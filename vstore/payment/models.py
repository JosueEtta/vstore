from django.db import models
from product.models import Product
from user.models import User

# Create your models here.
class Order(models.Model):
    amount = models.FloatField()
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

class Orderproduct(models.Model):
      product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
      order_id = models.ForeignKey(Order,on_delete=models.CASCADE)   
