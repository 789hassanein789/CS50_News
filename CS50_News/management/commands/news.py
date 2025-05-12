from CS50_News.models import New, User
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, *args, **options):
        user = User.objects.get(username="super")
        news = New.objects.all()
        for new in news:
            print(new.id)