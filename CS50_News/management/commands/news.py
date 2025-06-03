from CS50_News.models import New, User, Section, Page, Placement
from django.core.management.base import BaseCommand
from PIL import Image
from io import BytesIO
from math import isclose
import requests
from slugify import slugify

class Command(BaseCommand):
    def handle(self, *args, **options):
        user = User.objects.get(username="super")
        news = New.objects.all()
        section = Section.objects.get(page=Page.objects.get(name="Business"), name="M")
        pages = Page.objects.filter(parent__isnull=True)
        for page in pages:
            print(page.position)