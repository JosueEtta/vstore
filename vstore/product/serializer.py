from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Product
        fields = ['id','name','price','image','quantity']

    def create(self, validated_data):
        new_product = Product.objects.create(**validated_data)
        new_product.save()
        return new_product
