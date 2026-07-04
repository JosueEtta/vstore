from rest_framework import serializers
from .models import Order,Orderproduct

class OrderSerializer(serializers.Serializer):
    amount = serializers.FloatField()
    status = serializers.CharField(max_length=50)
    created_at = serializers.DateTimeField()
    user_id = serializers.IntegerField()

    def create(self, validated_data):
        new_order = Order.objects.create(**validated_data)
        new_order.save()
        return new_order

class OrderProductSerializer(serializers.Serializer):
      product_id = serializers.IntegerField()
      order_id = serializers.IntegerField()    

      def create(self, validated_data):
        new_order_product = Orderproduct.objects.create(**validated_data)
        new_order_product.save()
        return new_order_product