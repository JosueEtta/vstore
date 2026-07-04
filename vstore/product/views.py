from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .serializer import ProductSerializer
from .models import Product

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product(request):
    if request.user.role == "admin":
     serializer = ProductSerializer(data=request.data)
     if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    else:
       return Response({"data":"You don't have required priviliedge"},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def recent_products(request):     
    some_product = Product.objects.all()[:5]
    serializer = ProductSerializer(some_product,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_products(request):
   ismodified = False
   min_price = request.query_params.get("min_price")
   max_price = request.query_params.get("max_price")
   search = request.query_params.get("search")
   search_result = Product.objects.all()

   if search is not None:
      print("Search was hitted")
      search_result = search_result.all().filter(name__contains=search)
      ismodified = True
   if max_price != "":
      search_result = search_result.all().filter(price__lte = max_price)
      ismodified = True
   if min_price != "":
      print("MIn price was hitted")
      search_result = search_result.all().filter(price__gte= min_price)  
      ismodified = True

   if ismodified == False:
      print("Search resuult is None")
      return Response({"message":"NOT FOUND"},status=status.HTTP_404_NOT_FOUND) 
   else:  
     serializer = ProductSerializer(search_result,many=True)   
     return Response(serializer.data,status=status.HTTP_200_OK)    
      
   

