from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):

    def __str__(self):
        return f"{self.username}"
class New(models.Model):
    headline = models.CharField(max_length=200)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="CS50_News/files/covers" ,blank=True, null=True)
    content = models.CharField(max_length=10000)
    category = models.CharField(max_length=50)
    sub_category = models.CharField(max_length=50, default="", blank=True, null=True)
    auther = models.ForeignKey(User, on_delete=models.PROTECT, related_name="publishes")
    timestamp = models.DateTimeField(auto_now_add=True)