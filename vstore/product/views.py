from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from .serializer import ProductSerializer
from .models import Product
from .permission import IsAdminUser

# Create your views here.
class ProductAPI(APIView):

    def _admin_required(self, request):
       if not request.user or not request.user.is_authenticated:
          return Response({"message": "Authentication credentials were not provided"}, status=status.HTTP_401_UNAUTHORIZED)

       if getattr(request.user, "role", None) != "admin":
          return Response({"message": "You don't have required privilege"}, status=status.HTTP_403_FORBIDDEN)

       return None


    def post(self,request):
       admin_error = self._admin_required(request)
       if admin_error:
          return admin_error

       serializer = ProductSerializer(data=request.data)
       if serializer.is_valid():
          serializer.save()
          return Response(serializer.data,status=status.HTTP_201_CREATED)
       else:
          return Response(serializer.errors)
       

    def get(self,request,pk=None):
       if request.query_params.get("admin") == "true":
          admin_error = self._admin_required(request)
          if admin_error:
             return admin_error

       if pk:
          search_results = get_object_or_404(Product,pk=pk)
          data = {
             "id": search_results.id,
             "name" : search_results.name,
             "image" : search_results.image,
             "quantity": search_results.quantity,
             "price": search_results.price
          }
          serializer = ProductSerializer(data=data)
          print("Serializer is",serializer)
          if serializer.is_valid(raise_exception=True):
           return Response(serializer.data,status=status.HTTP_200_OK)
       else:
        search = request.query_params.get("search")  
        search_results = Product.objects.all().order_by("price") 
        paginator = PageNumberPagination()
        paginator.page_size = 8       

        if search is not None:          
          search_results = search_results.all().filter(name__contains=search)

        result_page = paginator.paginate_queryset(search_results,request) 
        serializer = ProductSerializer(result_page,many=True)  
        return paginator.get_paginated_response(serializer.data)
    
    def delete(self,request,pk=None):
       admin_error = self._admin_required(request)
       if admin_error:
          return admin_error

       if pk:
         product = get_object_or_404(Product,pk=pk)
         product.delete()
         return Response({"message":"Products was deleted"},status=status.HTTP_200_OK)
       else:       
          return Response({"message":"No product selected"},status=status.HTTP_400_BAD_REQUEST)
       
              
    def put(self,request,pk=None):
       admin_error = self._admin_required(request)
       if admin_error:
          return admin_error

       if pk:
          product = get_object_or_404(Product,pk=pk)
          serialzer = ProductSerializer(product,data=request.data,partial=True)
          if serialzer.is_valid():
             serialzer.save()
             return Response(serialzer.data,status=status.HTTP_200_OK)
          return Response(serialzer.errors,status=status.HTTP_400_BAD_REQUEST)
       else:
          return Response({"message":"No product selected"},status=status.HTTP_400_BAD_REQUEST)
         
        
   

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
     paginator = PageNumberPagination()
     result_page =  paginator.paginate_queryset(search_result,request)
     serializer = ProductSerializer(result_page,many=True)  
     return paginator.get_paginated_response(serializer.data)
      
   
