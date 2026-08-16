from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from unittest.mock import patch

from user.models import User
from order.models import Order


class PaymentTest(APITestCase):

    @patch("order.views.notchpay.payments.create")
    def test_make_payment(self, mock_create):
        """
        Ensure we can make a payment and get redirected to the authorization URL.
        """
        url = reverse("make_payment")
        user_data = {"name": "Neo", "email": "neom@gmail.com", "password": "pompom"}
        self.user = User.objects.create_user(**user_data, role="admin")
        self.user_auth = authenticate(**user_data)
        token = Token.objects.get_or_create(user=self.user_auth)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + str(token[0]))

        mock_create.return_value.authorization_url = "https://notchpay.test/pay"

        data = {
            "amount": 5000,
            "street": "Main Street",
            "city": "Yaounde",
            "country": "Cameroon",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertTrue(Order.objects.filter(user_id=self.user, amount=5000).exists())
        mock_create.assert_called_once()