from django.core.management.base import BaseCommand, CommandError
import requests.compat
from CS50_News.models import New, User
import requests
from bs4 import BeautifulSoup
from CS50_News.utils import slugify
import os
import re
from django.core.files.base import ContentFile
from urllib.parse import urlparse
from PIL import Image
from io import BytesIO

'''
class Command(BaseCommand):
    def handle(self, *args, **options):
        url = "https://www.bbc.com"
        sport_page = requests.get(f"{url}/sport")
        sport_soup = BeautifulSoup(sport_page.text, "html.parser")
        ul = sport_soup.find_all("span", "eis6szr1")
        sports = [li.text for li in ul]
        print(sports)
        for sport in sports:
            page = requests.get(f"{url}/sport/{sport.lower()}")
            soup = BeautifulSoup(page.text, "html.parser")
            articles = soup.find_all("div", attrs={"class": "e1vyq2e80", "data-testid": "promo"})
            i = 0
            for article in articles:
                print(i)
                request = None
                p = article.find("p", "exn3ah99")
                headline = p.find("span")
                if not headline or article.get("target") == "_self":
                    i += 1
                    continue
                article_url = article.find("a", "exn3ah94")["href"]
                if not article_url.startswith("http"):
                    article_url = "https://www.bbc.com" + article_url
                article_page = requests.get(article_url)
                article_soup = BeautifulSoup(article_page.text, "html.parser")
                article_content_soup = article_soup.find("article")
                if not article_content_soup:
                    i += 1
                    continue
                content_tag = article_content_soup.find_all(text_or_img)
                content = ""
                for tag in content_tag[1:]:
                    if tag.name == "img":
                        src = tag["src"]
                        src = re.sub(r"/news/\d+/", "/news/2048/", src)
                        src = re.sub(r"/standard/\d+/", "/standard/2048/", src)
                        src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                        src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                        content += f"![]({src})"
                    elif tag.name == "p":
                        if tag.find("b"):
                            content += f"**{tag.text}**\n\n"
                        else:
                            content += f"{tag.text}\n\n"
                    elif tag.name == "h2":
                        text = tag.find("span").text
                        content += f"##{text}\n\n"
                    else:
                        content += f"##{tag.text}\n\n"
                sub_category = article.find("span", "ivCQgh")
                category = "S"
                short_name = "FB"
                for key, dict in New.SUB_CATEGORIES.items():
                    values = [value.replace("_", " ") for value in dict.values()]
                    if sub_category and sub_category.text in values:
                        short_name = list(dict.keys())[list(dict.values()).index(sub_category.text.replace(" ", "_"))]
                        category = key
                if sub_category:
                    if sub_category.text in New.CATEGORYS.values():
                        category = sub_category.text[0].capitalize()
                article_img = article.find("img", "ldLcJe")
                if not article_img:
                    article_img = article_content_soup.find("img", "ldLcJe")
                if not article_img:
                    article_img = article_content_soup.find("img", "edrdn950")
                if article_img:
                    src = article_img.get("src")
                    src = re.sub(r"/news/\d+/", "/news/2048/", src)
                    src = re.sub(r"/standard/\d+/", "/standard/2048/", src)
                    src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                    src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                    print(src)
                    request = requests.get(src, stream=True)
                if request and request.status_code == 200:
                    name = os.path.basename(urlparse(src).path)
                slug = slugify(headline.text.replace("BBC", "CSN"))
                sub_headline = article.find("p")
                first_pargraph = article_content_soup.find("p", "hxuGS")
                if sub_headline:
                    sub_headline = sub_headline.text
                elif not sub_headline and first_pargraph:
                    sub_headline = first_pargraph.text
                else:
                    sub_headline = "no sub headline"
                print(slug)
                if New.objects.filter(slug=slug).exists():
                    New.objects.filter(slug=slug).delete()
                new = New(headline=headline.text.replace("BBC", "CSN"), sub_headline=sub_headline.replace("BBC", "CSN"), content=content.replace("BBC", "CSN"), auther=User.objects.get(username="super"), category=category, sub_category=short_name, slug=slug)
                if request:
                    new.image.save(name, ContentFile(request.content), save=True)
                new.save()
                print("saved")
                for tag in article_content_soup.find_all("a", "ed0g1kj0"):
                    new.tags.add(tag.text)
                new.save()
                i += 1
'''

class Command(BaseCommand):
    def handle(self, *args, **options):
        url = "https://www.bbc.com"
        page = requests.get(f"{url}/business") 
        p = requests.get(f"{url}/news/us-canada")
        soup = BeautifulSoup(p.text, "html.parser")
        articles = soup.find_all("a", "hMvGwj")
        i = 0
        for article in articles:
            print(i)
            request = None
            headline = article.find("h2", attrs={"data-testid": "card-headline"})
            if not headline or article.get("target") == "_self":
                i += 1
                print("no headline")
                continue
            article_url = article["href"]
            if not article_url.startswith("http"):
                article_url = "https://www.bbc.com" + article_url
            article_page = requests.get(article_url)
            article_soup = BeautifulSoup(article_page.text, "html.parser")
            article_content_soup = article_soup.find("article")
            if not article_content_soup:
                i += 1
                print("no article_soup")
                continue
            content_tag = article_content_soup.find_all(text_or_img)
            content = ""
            for tag in content_tag[1:]:
                if tag.name == "img":
                    src = tag["src"]
                    src = re.sub(r"/news/\d+/", "/news/2048/", src)
                    src = re.sub(r"/standard/\d+/", "/standard/2048/", src)
                    src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                    src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                    content += f"![]({src})"
                elif tag.name == "p":
                    content += f"{tag.text}\n\n"
                else:
                    content += f"##{tag.text}\n\n"
            sub_category = article.find("span", "ivCQgh")
            category = "N"
            short_name = "US&C"
            for key, dict in New.SUB_CATEGORIES.items():
                values = [value.replace("_", " ") for value in dict.values()]
                if sub_category and sub_category.text in values:
                    short_name = list(dict.keys())[list(dict.values()).index(sub_category.text.replace(" ", "_"))]
                    category = key
            if sub_category:
                if sub_category.text in New.CATEGORYS.values():
                    category = sub_category.text[0].capitalize()
            article_img = article.find("img", "dvfjxj")
            if not article_img:
                article_img = article_content_soup.find("img", "ldLcJe")
                if not article_img:
                    article_img = article_content_soup.find("img", "edrdn950")
            if article_img:     
                src = article_img.get("src")
                src = re.sub(r"/news/\d+/", "/news/2048/", src)
                src = re.sub(r"/standard/\d+/", "/standard/2048/", src)
                src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                src = re.sub(r"/ic/\d+x\d+/", "/ic/1920x1080/", src)
                request = requests.get(src, stream=True)
            if request and request.status_code == 200:
                img = Image.open(BytesIO(request.content))
                w, h = img.size
                aspect_ratio = w / h
                if abs(aspect_ratio - 16 / 9) > 0.05:
                    i += 1
                    print("no aspect_ratio")
                    continue
                name = os.path.basename(urlparse(src).path)
            slug = slugify(headline.text)
            sub_headline = article.find("p")
            first_pargraph = article_content_soup.find("p", "hxuGS")
            if sub_headline:
                sub_headline = sub_headline.text
            elif not sub_headline and first_pargraph:
                sub_headline = first_pargraph.text
            else:
                sub_headline = "no sub headline"
            print(slug)
            if New.objects.filter(slug=slug).exists():
                New.objects.filter(slug=slug).delete()
            new = New(headline=headline.text, sub_headline=sub_headline, content=content, auther=User.objects.get(username="super"), category=category, sub_category=short_name, slug=slug)
            if request:
                new.image.save(name, ContentFile(request.content), save=True)
            new.save()
            print("saved")
            for tag in article_content_soup.find_all("a", "emeJAW"):
                new.tags.add(tag.text)
            new.save()
            i += 1


def text_or_img(tag):
    return tag.get("class") == ["sc-9a00e533-0", "hxuGS"] or tag.get("class") == ["sc-4abb68ca-0", "ldLcJe"] or tag.get("class") == ["sc-737179d2-0", "erjHHi"]

#def text_or_img(tag):
#    return tag.get("class") == ["ssrcss-1q0x1qg-Paragraph", "e1jhz7w10"] or tag.get("class") == ["ssrcss-pbttu9-Heading", "e10rt3ze0"] or tag.get("class") == ["holding_image"] or tag.get("class") == ["ssrcss-11yxrdo-Image", "edrdn950"]