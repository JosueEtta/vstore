from django.urls import include, path
from . import views

urlpatterns = [
  path("create_prodcut/",views.create_product,name="create_product"),
  path("get_recent_products/",views.recent_products,name="recent_products"),
  path("serach_product/",views.search_products,name="search_products")
]