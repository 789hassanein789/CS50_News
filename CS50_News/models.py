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
    SUB = {
        "N": "News",
        "IG": "Israil-Gaza war",
        "UR": "Ukraine-Russia war",
        "IQ": "Iraq",
        "US&C": "US & Canada",
        "MD": "Middle East",
        "EU": "Europe",
        "AS": "Asia",
        "AF": "Africa",
        "AU": "Australia",
        "LA": "Latine America",

        "SP": "Sport",
        "MA": "Martial Arts",
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
    headline = models.CharField(max_length=200)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="CS50_News/static/CS50_News/cover" ,blank=True, null=True)
    content = models.TextField(max_length=10000)
    category = models.CharField(max_length=50, choices=CATEGORYS)
    views = models.IntegerField(default=0)
    scroll = models.IntegerField(default=0)
    score = models.IntegerField(default=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    sub_category = models.CharField(max_length=25, choices=SUB, default="IG")
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")

