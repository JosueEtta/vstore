from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        new_user = User.objects.create_user(**validated_data, role='client')
        new_user.save()
        return new_user

    def auth_user(self, validated_data):
        user = authenticate(email=validated_data['email'], password=validated_data['password'])
        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        return user


class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if user is None:
            raise AuthenticationFailed('Invalid email or password.')

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'accessToken': str(refresh.access_token),
            'refreshToken': str(refresh),
            'userRole': user.role,
            'role': user.role,
        }
          