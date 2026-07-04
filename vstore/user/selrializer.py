from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','email','password']
        extra_kwargs = {
            "password":{"write_only":True},
            "email":{"required":True}
        }    

    def create(self,validated_data):
         print("A method called me")
         new_user =  User.objects.create_user(**validated_data,role="client")
         new_user.save()
         return new_user

    def auth_user(self,validated_data):
      """
        Authenticate user and raise validation error if it fails.
      """  
      user = authenticate(email = validated_data["email"],password = validated_data["password"])
      if user is None:
          raise serializers.ValidationError("Invalid Credentials")
      return user
          