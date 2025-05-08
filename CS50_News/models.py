import datetime
import pytz
from django.contrib.auth.models import AbstractUser
from django.db import models
from taggit.managers import TaggableManager, TaggedItem

# Create your models here.
class User(AbstractUser):
    saved_articles = models.ManyToManyField("New")
    
    def __str__(self):
        return f"{self.username}"
    
class New(models.Model):
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
            "US&C": "US_&_Canada",
            "MD": "Middle_East",
            "EU": "Europe",
            "AS": "Asia",
            "AF": "Africa",
            "AU": "Australia",
            "LA": "Latine_America",
            "WO": "World",
            "PO": "Politics",
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
        "B": {
            "B": "Business"
        },
        "I": {
            "TECH": "Technology",
            "S&HE": "Science_&_Health",
            "FU": "Future",
            "CL": "Climate",
        },
        "C": {
            "CU": "Culture",
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
    headline = models.CharField(max_length=100)
    sub_headline = models.CharField(max_length=200)
    image = models.ImageField(upload_to="images", default="images/test-img.jpg")
    content = models.TextField()
    views = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, choices=CATEGORYS, null=True, blank=True)
    sub_category = models.CharField(max_length=50, choices=SUB_CATEGORIES, null=True, blank=True)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publishes")
    tags = TaggableManager(through=TaggedItem)
    slug = models.SlugField(default="" , null=False, unique=True, max_length=100)

    def timesince(self):
        value = str(datetime.datetime.now(tz=pytz.UTC) - self.timestamp)
        for i, s in enumerate(value):
            if s == ',':
                return f"{value[:i]}&nbspago"
        if len(value) > 0:
            if value[:3] == "0:0":
                return "now"
            if value[0] == "0":
                return f"{value[2:4]}&nbspminutes&nbspago"
            return f"{value[0]}&nbsphrs&nbspago"
            
        


    
class Page(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(default="", unique=True)

    def __str__(self):
        return self.name


class Section(models.Model):
    SECTIONS = {
        "H": "hero",
        "C": "carousel",
        "F": "featured",
        "L": "left",
        "N": "news",
        "O": "only",
        "R": "right",
        "S": "scroll",
        "M": "more",
        "T": "trending",
    }
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="sections")
    name = models.CharField(max_length=100, choices=SECTIONS, null=True, blank=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    position = models.PositiveIntegerField()  # Order within the page

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return f"{self.page.name} - {self.SECTIONS[self.name]}"


class Placement(models.Model):
    article = models.ForeignKey("New", on_delete=models.CASCADE, related_name="placements")
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="articles")
    position = models.PositiveIntegerField(default=0)  # Order within the section

    class Meta:
        ordering = ["position"]