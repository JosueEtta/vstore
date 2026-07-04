from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User


# Create your tests here.
class CreateAccountTest(APITestCase):
   
   def test_create_account(self):
    """
     Ensure account is succesfuly created
    """
    url = reverse("create_account") 
    data = {"name":"Joshua","email":"kiram@gmail.com","password":"pompom"}
    response = self.client.post(url,data,format='json')
    self.assertEqual(response.status_code,status.HTTP_201_CREATED)

   def test_empty_input_input(self):
    """
     Ensure input is not empty
    """
    url = reverse("create_account") 
    data = {"email":"","password":"del"}
    response = self.client.post(url,data,format='json')
    self.assertEqual(response.status_code,status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginTest(APITestCase):

   def test_login(self):
     url = reverse("login")
     data = {"name":"Joshua","email":"neom@gmail.com","password":"pompom"}
     new_user = User.objects.create_user(**data,role="client")
     new_user.save()
     response = self.client.post(url,data,format='json')
     print(response.data)
     self.assertEqual(response.status_code,status.HTTP_200_OK)