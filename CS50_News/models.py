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
    content = models.TextField()
    views = models.IntegerField(default=0)
    scroll = models.IntegerField(default=0)
    score = models.IntegerField(default=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")

class Category(models.Model):
    CATEGORYS = {
        "N": "News",
        "S": "Sport",
        "B": "Business",
        "I": "Innovation",
        "C": "Culture",
        "T": "Travel",
        "E": "Earth",
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


        "MA": "Martial_Arts",
        "FB": "Football",
        "CR": "Cricket",
        "F1": "Formula_1",
        "TE": "Tennis",
        "GO": "Golf",
        "AT": "Athletics",
        "CY": "Cycling",

        "TECH": "Technology",
        "S&HE": "Science_&_Health",

        "BOOK": "Books",
        "ST": "Style",
        "TV": "Film_&_TV",
        "MS": "Music",
        "AR&D": "Art_&_Design",
        "EN": "Entertainment",

        "DE": "Destinations",
        "FOOD": "Food_&_Drink",
        "AD": "Adventures",

        "NW": "Natural_Wonders",
        "WE&C": "Weather_&_Climate",
    }
    category = models.CharField(max_length=50, choices=CATEGORYS)
    parent = models.CharField(max_length=50, choices=CATEGORYS, null=True, blank=True)
    news = models.ManyToManyField(New, related_name="category", null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.category}"