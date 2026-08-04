"""
URL configuration for vstore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from user import urls
from product import urls
from order import urls
from rest_framework_simplejwt.views import TokenRefreshView
from user.views import CustomTokenObtainPairView

urlpatterns = [
      path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
      path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
      path("api/v1/user/",include("user.urls")),
      path("api/v1/product/",include("product.urls")),
      path("api/v1/order/",include("order.urls")),
      path('admin/', admin.site.urls),
      path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
