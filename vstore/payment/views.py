from django.shortcuts import redirect, render
from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from notchpay import NotchPay


# Create your views here.
notchpay = NotchPay(settings.NOTCHPAY_API_KEY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request):
    try:
        amount = request.data.get('amount')
        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        payment = notchpay.payments.create({
        'amount': amount,
        'currency': 'XAF',
        'customer': {
            'email': request.user.email,
            'name': request.user.name,
        },
        'reference': f"order_{request.user.name}_{amount}",
        'callback': request.build_absolute_uri('/payment/callback/'),
        })
        print("Payment authorization URL: ", payment)
    
        return redirect(payment.authorization_url)
    except Exception as e:
        print("Error occurred while making payment: ", str(e))
        print("Error type: ", type(e))
        print("Error representation: ", repr(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_callback(request):
    reference = request.data.get('reference')
    payment = notchpay.payments.verify(reference)
    
    if payment.status == 'success':
        # Handle successful payment (e.g., update order status, send confirmation email)
        return Response({'message': 'Payment successful'})
    else:
        # Handle failed payment
        return Response({'message': 'Payment failed'}, status=status.HTTP_400_BAD_REQUEST)
    
    

