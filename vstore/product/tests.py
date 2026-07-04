import os
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase,RequestsClient,URLPatternsTestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from user.models import User
from .models import Product

# Create your tests here.

class ProductTest(APITestCase):

    def setUp(self):
        self.image_path = os.path.join(os.path.dirname(__file__),'fixtures','chair.jpeg')

    def test_create_product_test(self):
        """
          Ensure product is created
        """
        url = reverse("create_product") 
        with open(self.image_path,'rb') as img:
           image_file = SimpleUploadedFile(
            name = 'chair.jpeg',
            content = img.read(),
            content_type = 'image/jpeg'
            ) 
        data = {"name":"Nike shoe","price":20000,"image":image_file,"quantity":20}  
        user_data = {"name":"Neo","email":"neom@gmail.com","password":"pompom"}
        new_user = User.objects.create_user(**user_data,role="admin")
        user_auth=authenticate(**user_data)
        token = Token.objects.get_or_create(user=user_auth)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + str(token[0]))
        response = self.client.post(url,data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)

    def test_get_many_products(self):
        """
         Ensure the most recent products are gotten
        """
        url = reverse("recent_products") 
        with open(self.image_path,'rb') as img:
           image_file = SimpleUploadedFile(
            name = 'chair.jpeg',
            content = img.read(),
            content_type = 'image/jpeg'
            ) 
        data = {"name":"Nike shoe","price":20000,"image":image_file,"quantity":20,}  
        for i in range(10):
            Product.objects.create(**data)
        response = self.client.get(url) 
        self.assertEqual(response.status_code,status.HTTP_200_OK) 

    def test_product_search(self):  
        """
         Check wether parameters are well passed
        """   
        url = reverse("search_products")
        with open(self.image_path,'rb') as img:
           image_file = SimpleUploadedFile(
            name = 'chair.jpeg',
            content = img.read(),
            content_type = 'image/jpeg'
            ) 
        all_products = [
            {"name":"Nike shoe","price":20000,"image":image_file,"quantity":20} ,
            {"name":"Iphone","price":50000,"image":image_file,"quantity":20},
            {"name":"Television","price":20000,"image":image_file,"quantity":20},
            {"name":"Television","price":20000,"image":image_file,"quantity":20},
            {"name":"Television","price":20000,"image":image_file,"quantity":20}, 
            {"name":"Trouser","price":2000,"image":image_file,"quantity":20},
            {"name":"Shirt","price":10000,"image":image_file,"quantity":20} 
        ]
        for product in all_products:
            Product.objects.create(**product)
        url = reverse("search_products")
        response = self.client.get(url,{"search":"","max_price":2000})
        print("Response to the request is : ",response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)     
