from typing import Iterable
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    validation_date = models.DateTimeField(null=True, blank=True)
    otp_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.username}"
    
class Sub_Category(models.Model):
    SUB = {
        "N": "News",
        "IG": "Israil-Gaza_war",
        "UR": "Ukraine-Russia_war",
        "IQ": "Iraq",
        "US&C": "US_&_Canada",
        "MD": "Middle_East",
        "EU": "Europe",
        "AS": "Asia",
        "AF": "Africa",
        "AU": "Australia",
        "LA": "Latine_America",

        "SP": "Sport",
        "MA": "Martial_Arts",
        "FB": "Football",

        "IN": "Innovation",
        "TECH": "Technology",
        "HE": "Health",

        "CU": "Culture",
        "BOOK": "Books",
        "STY": "Style",

        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
    }
    category = models.CharField(max_length=10, choices=SUB)

    def __str__(self):
        return f"{self.category}"

class New(models.Model):
    CATEGORYS = {
        "N": "News",
        "S": "Sport",
        "B": "Business",
        "I": "Innovation",
        "C": "Culture",
        "A": "Art",
        "T": "Travel",
        "E": "Earth",
    }
    headline = models.CharField(max_length=200)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="CS50_News/static/CS50_News/cover" ,blank=True, null=True)
    content = models.TextField(max_length=10000)
    category = models.CharField(max_length=50, choices=CATEGORYS)
    views = models.IntegerField(default=0)
    scroll = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    sub_category = models.ManyToManyField(Sub_Category)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")

