from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager 

#create your manager here.
class UserManager(BaseUserManager):
    def create_user(self,name,email,password,role="client"):
        if not name:
            raise ValueError("User must have a name")
        if not email:
            raise ValueError("User must have an email address")
        
        if not password:
             raise ValueError("User must have a password")
        
        user = self.model(name=name,email = self.normalize_email(email),role = role)

        user.set_password(password)
        user.save(using=self._db)

        return user


# Create your models here.
class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ("client","Client"),
        ("admin","Admin")
    )
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField()
    role = models.CharField(choices=ROLE_CHOICES)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['password','name']

    objects = UserManager()


