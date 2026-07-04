from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import status
from .selrializer import SignupSerializer

# Create your views here.
@api_view(['POST'])
def create_account(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(data={"message:User has been created"},status=status.HTTP_201_CREATED)
    else:
        return Response(data=serializer.error_messages,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def login(request):
    serializer = SignupSerializer(data=request.data)
    user = serializer.auth_user(validated_data=request.data)
    if user is not None:
      token = Token.objects.get_or_create(user=user)
      return Response({"token":str(token[0])},status=status.HTTP_200_OK)
    else:
       return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



