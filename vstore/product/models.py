from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField()
    price = models.IntegerField()
    image = models.ImageField(upload_to="images/",default="fixtures/chair.jpeg")
    quantity = models.IntegerField()




