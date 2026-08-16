from django.db import models
from product.models import Product
from user.models import User

# Create your models here.
class Order(models.Model):
    amount = models.IntegerField()
    order_status = models.CharField(max_length=50,default="not delivered")
    payment_status = models.CharField(max_length=50,default="not payed")
    payment_method = models.CharField(max_length=50,default="MTN")
    created_at = models.DateField(auto_now=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    Street = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)

class Orderproduct(models.Model):
      product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
      order_id = models.ForeignKey(Order,on_delete=models.CASCADE)   
