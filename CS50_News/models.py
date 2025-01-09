import datetime
import pytz
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timesince
from taggit.managers import TaggableManager, TaggedItem

# Create your models here.
class User(AbstractUser):
    validation_date = models.DateTimeField(null=True, blank=True)
    otp_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.username}"
    
class New(models.Model):
    SECTIONS =  {
        "H": "hero",
        "S": "side",
        "T": "top_stories",
        "F": "featured",
        "O": "only"
    }
    CATEGORYS = {
        "N": "News",
        "S": "Sport",
        "B": "Business",
        "I": "Innovation",
        "C": "Culture",
        "T": "Travel",
        "E": "Earth",
    }
    SUB_CATEGORIES = {
        "N" : {   
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
        },
        "S": {
            "MA": "Martial_Arts",
            "FB": "Football",
            "CR": "Cricket",
            "F1": "Formula_1",
            "TE": "Tennis",
            "GO": "Golf",
            "AT": "Athletics",
            "CY": "Cycling",
        },
        "I": {
            "TECH": "Technology",
            "S&HE": "Science_&_Health",
        },
        "C": {
            "BOOK": "Books",
            "ST": "Style",
            "TV": "Film_&_TV",
            "MS": "Music",
            "AR&D": "Art_&_Design",
            "EN": "Entertainment",
        },
        "T": {
            "DE": "Destinations",
            "FOOD": "Food_&_Drink",
            "AD": "Adventures",
        },
        "E": {
            "NW": "Natural_Wonders",
            "WE&C": "Weather_&_Climate",
        }
    }
    headline = models.CharField(max_length=200)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="CS50_News/static/CS50_News/cover" ,blank=True, null=True)
    content = models.TextField()
    views = models.IntegerField(default=0)
    score = models.IntegerField(default=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, choices=CATEGORYS)
    sub_category = models.CharField(max_length=50, choices=SUB_CATEGORIES)
    section = models.CharField(max_length=50, choices=SECTIONS, null=True, blank=True)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")
    tags = TaggableManager(through=TaggedItem)

    def timesince(self):
        return (self.timestamp - datetime.datetime.now(tz=pytz.UTC)).total_seconds()