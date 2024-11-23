from django.core.management import BaseCommand, CommandError
from CS50_News.models import New
import datetime
import pytz

class Command(BaseCommand):
    help = "score news articls"

    def handle(self, *args, **options):
        news = New.objects.all()
        for new in news:
            self.stdout.write(f"{new.score}", ending="\n")
            