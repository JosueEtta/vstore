from django.urls import include, path
from . import views

urlpatterns = [
   path("create_account/",views.create_account,name="create_account"),
   path("login/",views.login,name="login"),
]