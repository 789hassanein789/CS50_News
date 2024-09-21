from typing import Iterable
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    validation_date = models.DateTimeField(null=True, blank=True)
    otp_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.username}"
    
class New(models.Model):
    headline = models.CharField(max_length=200)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="CS50_News/static/CS50_News/cover" ,blank=True, null=True)
    content = models.CharField(max_length=10000)
    category = models.CharField(max_length=50)
    sub_category = models.CharField(max_length=50, default="", blank=True, null=True)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")