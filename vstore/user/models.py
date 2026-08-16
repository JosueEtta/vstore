from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

#create your manager here.
class UserManager(BaseUserManager):
    def create_user(self, name, email, password, role="client", **extra_fields):
        if not name:
            raise ValueError("User must have a name")
        if not email:
            raise ValueError("User must have an email address")

        if not password:
             raise ValueError("User must have a password")

        extra_fields.setdefault("is_active", True)

        user = self.model(
            name=name,
            email=self.normalize_email(email),
            role=role,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, name, role="admin", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(name, email, password, role=role, **extra_fields)


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("client","Client"),
        ("admin","Admin")
    )
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField()
    role = models.CharField(choices=ROLE_CHOICES, default="client")
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()


