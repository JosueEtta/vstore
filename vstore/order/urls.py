from django.urls import include, path
from . import views


urlpatterns = [   
  path("make_payment/",views.make_payment,name="make_payment"),
  path("payment_callback/",views.payment_callback,name="payment_callback")
]