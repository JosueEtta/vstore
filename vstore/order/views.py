from django.shortcuts import redirect
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.db import transaction
from notchpay import NotchPay

from product.models import Product
from .models import Order, Orderproduct


def get_notchpay_client():
    api_key = settings.NOTCHPAY_API_KEY
    if not api_key:
        raise ValueError('Notcha Pay API key is not configured.')
    return NotchPay(api_key)


def create_notcha_payment_transaction(user, payload):
    amount = payload.get('amount')
    if not amount:
        raise ValueError('Amount is required')

    products = payload.get('products') or payload.get('order_products') or []
    if not products:
        raise ValueError('At least one product is required for this order.')

    order_data = {
        'amount': int(amount),
        'user_id': user,
        'Street': payload.get('Street') or payload.get('street') or 'N/A',
        'city': payload.get('city') or 'N/A',
        'country': payload.get('country') or 'N/A',
        'order_status': payload.get('order_status', 'pending'),
        'payment_status': payload.get('payment_status', 'pending'),
        'payment_method': payload.get('payment_method', 'MTN'),
    }

    with transaction.atomic():
        order = Order.objects.create(**order_data)

        for item in products:
            if isinstance(item, dict):
                product_id = item.get('product_id') or item.get('productId') or item.get('id')
            else:
                product_id = item

            if not product_id:
                raise ValueError('Each product in the order must include a valid product_id.')

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist as exc:
                raise ValueError(f'Product with id {product_id} does not exist.') from exc

            Orderproduct.objects.create(product_id=product, order_id=order)

        reference = f"order_{order.id}_{amount}"
        client = get_notchpay_client()
        payment = client.payments.create({
            'amount': amount,
            'currency': 'XAF',
            'customer': {
                'email': user.email,
                'name': user.name,
            },
            'reference': reference,
            'callback': 'api/v1/order/payment_callback',
        })

        auth_url = getattr(payment, 'authorization_url', None)
        if not auth_url and isinstance(payment, dict):
            auth_url = payment.get('authorization_url')
        if not auth_url:
            raise ValueError('Notcha Pay did not return an authorization URL.')

        return order, auth_url


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request):
    try:
        _, authorization_url = create_notcha_payment_transaction(request.user, request.data)
        return redirect(authorization_url)
    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        print('Error occurred while making payment: ', str(exc))
        return Response({'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_callback(request):
    reference = request.data.get('reference')
    if not reference:
        return Response({'error': 'Payment reference is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        client = get_notchpay_client()
        payment = client.payments.verify(reference)
        payment_status = getattr(payment, 'status', None)
        if isinstance(payment, dict):
            payment_status = payment.get('status')

        if str(payment_status).lower() in {'success', 'paid', 'completed'}:
            return Response({'message': 'Payment successful'})
        return Response({'message': 'Payment failed'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response({'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


