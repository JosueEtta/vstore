from django.urls import include, path
from . import views
from .views import ProductAPI

urlpatterns = [
  path('',views.ProductAPI.as_view(),name="product"),  
  path("<int:pk>/",ProductAPI.as_view(),name="specif_products"),  
  path("create_prodcut/",views.create_product,name="create_product"),
  path("get_recent_products/",views.recent_products,name="recent_products"),
  path("serach_product/",views.search_products,name="search_products")
]