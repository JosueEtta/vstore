from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from user.models import User



class PaymentTest(APITestCase):

    def test_make_payment(self):
        """
        Ensure we can make a payment and get redirected to the authorization URL.
        """
        url = reverse("make_payment")
        user_data = {"name":"Neo","email":"neom@gmail.com","password":"pompom"}
        self.user = User.objects.create_user(**user_data, role='admin')
        self.user_auth = authenticate(**user_data)
        token = Token.objects.get_or_create(user=self.user_auth)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + str(token[0]))

        data = {'amount': 5000}
        response = self.client.post(url, data, format='json')
        print("Response to the request is : ", response.content)

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)