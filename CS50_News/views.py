from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django import forms
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.core.paginator import Paginator
from django.template.defaulttags import register
from django.core import serializers
from datetime import datetime, timezone
from allauth.account.decorators import login_required, verified_email_required, secure_admin_login, reauthentication_required, reauthentication
from django.contrib.admin.views.decorators import staff_member_required
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Count
from PIL import Image
from io import BytesIO
from sys import getsizeof
from math import isclose
from allauth.account.views import ConfirmEmailVerificationCodeView
from taggit.models import Tag
import pyotp
import json
from markdown2 import Markdown

from .models import User, New, Page, Section, Placement
from .utils import send_otp, Rescore, short_category

section_names = Section.SECTIONS

def index(request, cat=None, sub=None, key=None):
    Rescore(New.objects.all())
    sub_categories = None
    if cat == None:
        page = Page.objects.get(slug="Home")
        sections = page.sections.prefetch_related("articles__article")
    # make sure the cat is valid.
    elif cat and not sub:
        page = Page.objects.get(slug=cat)
        sections = page.sections.prefetch_related("articles__article")
        if cat != "Business":
            sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        page = Page.objects.get(slug=sub)
        print(page)
        sections = page.sections.prefetch_related("articles__article")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
    # TODO: filter on section not just category.
    
    for section in sections:
        section.include_name = f"CS50_News/sections/_{section_names[section.name]}.html"

    return render(request, "CS50_News/index.html", {
        "sections" : sections,
        "subs": sub_categories,
        "parent": cat,
        "sub_category": sub,
        "key": key
    })

def search(request):
    q = request.GET.get("q")
    q = q.capitalize().strip()
    news = New.objects.filter(headline__contains=q)
    Paginators = Paginator(news, 10)
    pagenumber = request.GET.get("p")
    all_news = Paginators.get_page(pagenumber)
    return render(request, "CS50_News/search.html", {
        "news": all_news,
        "input": q,
    })

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@secure_admin_login
def admin_view(request):
    return render(request, "CS50_News/admin.html", {
        "news": New.objects.filter(auther=request.user).order_by("-timestamp"),
        "users": User.objects.all(),
        "sections": Page.objects.get(name="Home").sections.prefetch_related("articles__article")
    })

@secure_admin_login
def add_new(request):
    if request.method == "POST":
        headline = request.POST.get("headline")
        sub_headline = request.POST.get("sub_headline")
        category = request.POST.get("category")
        sub_category = request.POST.get("sub_category")
        tags = request.POST.get("tags").lower()
        content = request.POST.get("content")
        image = request.FILES.get("blob")
        
        short_name = short_category(sub_category)
        if not sub_category in New.SUB_CATEGORIES[category[0]].values():
            return HttpResponse("the provided sub category isn't part of the category provided", status=400)
        with Image.open(image) as img:
            w, h = img.size
            aspect_ratio = 16 / 9
            if isclose(w / h, aspect_ratio):
                newh = h
                neww = int(h * aspect_ratio)

                if neww > w:
                    neww = w
                    newh = int(w / aspect_ratio)
                
                left = (w - neww) / 2
                top = (h - newh) / 2
                right = (w + neww) / 2
                bottom = (h + newh) / 2
                img = img.crop((left, top, right, bottom))

                img_io = BytesIO()
                img.save(img_io, format='PNG')  # Change format if necessary
                img_io.seek(0)

                cropped_image_file = InMemoryUploadedFile(
                img_io,
                field_name="image",
                name=image.name,
                content_type="image/png",
                size=getsizeof(img_io),
                charset=None
                )
                new = New(headline=headline, sub_headline=sub_headline, image=cropped_image_file, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=headline.replace(" ", "-"))
                new.save()
            else:
                new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=headline.replace(" ", "-"))
                new.save()
        
        try:
            tags = tags.split(",")
            for tag in tags:
                new.tags.add(tag)
            new.save()
        except:
           return HttpResponse({"could not create the article"}, status=400)
        return HttpResponseRedirect(reverse("staff"))
    suggestions = Tag.objects.all().annotate(num_tags=Count("new")).order_by("-num_tags")
    return render(request, "CS50_News/editor.html", {
        "categories": New.CATEGORYS.values(),
        "subs": New.SUB_CATEGORIES,
        "suggestions": suggestions,
    }
)

@secure_admin_login
def edit_new(request, slug=None):
    if request.method == "POST":
        new = New.objects.get(slug=slug)
        user = User.objects.get(id=request.user.id)
        if new.auther != request.user and not user.is_superuser:
            return HttpResponse(status=403)
        headline = request.POST.get("headline")
        sub_headline = request.POST.get("sub_headline")
        category = request.POST.get("category")
        sub_category = request.POST.get("sub_category")
        tags = request.POST.get("tags").lower()
        content = request.POST.get("content")
        image = request.FILES.get("blob")
        
        short_name = short_category(sub_category)
        if not sub_category in New.SUB_CATEGORIES[category[0]].values():
            return HttpResponse("the provided sub category isn't part of the category provided", status=400)
        with Image.open(image) as img:
            w, h = img.size
            aspect_ratio = 16 / 9
            if isclose(w / h, aspect_ratio):
                newh = h
                neww = int(h * aspect_ratio)

                if neww > w:
                    neww = w
                    newh = int(w / aspect_ratio)
                
                left = (w - neww) / 2
                top = (h - newh) / 2
                right = (w + neww) / 2
                bottom = (h + newh) / 2
                img = img.crop((left, top, right, bottom))

                img_io = BytesIO()
                img.save(img_io, format='PNG')  # Change format if necessary
                img_io.seek(0)

                cropped_image_file = InMemoryUploadedFile(
                img_io,
                field_name="image",
                name=image.name,
                content_type="image/png",
                size=getsizeof(img_io),
                charset=None
                )
                new.image=cropped_image_file 
            else:
                new.image=image
        new.headline=headline
        new.sub_headline=sub_headline
        new.content=content
        new.auther=request.user
        new.category=category[0]
        new.sub_category=short_name
        new.slug=headline.replace(" ", "-")
        new.save()
        try:
            tags = tags.split(",")
            for tag in tags:
                new.tags.add(tag)
            new.save()
        except:
           return HttpResponse({"could not Edit the article"}, status=400)
        return HttpResponseRedirect(reverse("staff"))
    new = New.objects.get(slug=slug)
    suggestions = Tag.objects.all().annotate(num_tags=Count("new")).order_by("-num_tags")
    return render(request, "CS50_News/editor.html", {
        "categories": New.CATEGORYS.values(),
        "subs": New.SUB_CATEGORIES,
        "suggestions": suggestions,
        "new": new
    }
)

@secure_admin_login
def delete_new(request):
    if request.method == "POST":
        try:
            id = request.POST.get("id")
            new = New.objects.get(id=id)
            new.delete()
        except:
            return HttpResponse(status=404)
        return HttpResponseRedirect(reverse("index"))
    return HttpResponse(status=405)

def passwordCheck(request):
    user = User.objects.get(id=request.user.id)
    if user.check_password(request.POST.get("password")):
        user.validation_date = datetime.now(timezone.utc)
        user.save()
        return JsonResponse({"email":user.email, "first":user.first_name, "last":user.last_name }, status = 200)
    return HttpResponse(status = 404)

def otp_view(request):
    if request.method == "POST":
        otp = request.POST.get("otp")
        otp_secret_key = request.session["otp_secret_key"]
        otp_valid_util = request.session["otp_valid_until"]
        if not (otp_secret_key and otp_secret_key):
            return HttpResponse(status=500)
        valid_until = datetime.fromisoformat(otp_valid_util)
        if not valid_until > datetime.now():
                    return HttpResponse(status=408)
        totp = pyotp.TOTP(otp_secret_key, interval=360)
        if not totp.now() == otp:
            return HttpResponse(status=401)
        user = User.objects.get(id=request.user.id)
        user.otp_date = datetime.now(timezone.utc)
        return HttpResponse(status=200)
    send_otp(request)
    return HttpResponse(status=200)

def delete_account(request):
    if (
            request.user.is_anonymous
            or not reauthentication.did_recently_authenticate(request)
        ):
        return HttpResponseRedirect(reverse("index"))
    if request.method == "POST":
        try:
            user = request.user
            user.delete()
            return HttpResponseRedirect(reverse("index"))
        except User.DoesNotExist:
            return HttpResponse({"error":"There is no such account, please reload the page and try again"}, status=500)
    return HttpResponse({"error":"bad request method"}, status=405)

def accountEdit(request):
    if (
        request.user.is_anonymous
        or not reauthentication.did_recently_authenticate(request)
        ):
        return HttpResponseRedirect(reverse("index"), status=403)
    if request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.get(id=request.user.id)
        try:
            user.username = data.get("username")
            user.save()
        except IntegrityError:
            return HttpResponse(status=400)
        return HttpResponse(status=200)
    return HttpResponse(status=405)

def crop(request):
    if request.method == 'POST':
        blob = request.FILES.get('blob')
        return HttpResponse(200)
    return render(request, "CS50_News/crop.html")

def new(request, cat, sub, slug):
    try:
        news = New.objects.prefetch_related("auther").get(slug=slug, category=cat[0])
    except New.DoesNotExist:
        return HttpResponse({"error": "there is no such article"}, status=404)
    user = None
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id).saved_articles.filter(id=news.id).exists()
    related =  news.tags.similar_objects()[:3]
    markdown = Markdown()
    if news.content:
        news.content = markdown.convert(news.content)
    return render(request, "CS50_News/new.html", {
        "new": news,
        "relatedNews": related,
        "tags": news.tags.names(),
        "saved": user,
    })

def reset(request, key):
    return render(request, "CS50_News/reset.html", {
        "key": key
    })

def reauthenticate_decision(request):
    if (
            request.user.is_anonymous
            or not reauthentication.did_recently_authenticate(request)
            ):
        return HttpResponse(status=401)
    else:
        return HttpResponse(status=200)
    
def check(request):
    return render(request, "CS50_News/index.html")

def settings(request):
    return render(request, "CS50_News/setting.html")

def tag(request, tag):
    news = New.objects.filter(tags__name__in=[tag]).order_by("timestamp")
    pagenator = Paginator(news, 10)
    pagenum = request.GET.get("p")
    news = pagenator.get_page(pagenum)
    return render(request, "CS50_News/search.html", {
        "news": news,
        "tag": tag
    })

class CustomConfirmCode(ConfirmEmailVerificationCodeView):
    def form_valid(self, form):
        response = super().form_valid(form)
        return JsonResponse({
            "message": "Email confirmed successfully!",
            "redirect_url": reverse('home') + "?auth=confirm-email"
        })
    
def save_new(request, headline=None):
    if request.method == "POST":
        if headline == None:
            return HttpResponse(status=400)
        user = User.objects.get(id=request.user.id)
        article = New.objects.get(slug=headline)
        if user.saved_articles.filter(id=article.id).exists():
            user.saved_articles.remove(article)
        else:
            user.saved_articles.add(article)
        return HttpResponse(status=200)
    news = User.objects.get(id=request.user.id).saved_articles.all()
    paginator = Paginator(news, 10)
    num = request.GET.get("p")
    news = paginator.get_page(num)
    return render(request, "CS50_News/search.html", {
        "news": news,
        "tag": "saved"
    })

def admin_pop(request):
    cat_list = New.SUB_CATEGORIES
    for name, category in cat_list.items():
        if name == "B":
            continue
        for cat in category:
            p = Page(name=category[cat], slug=category[cat].replace(" ", "-"))
            p.save()
    return HttpResponse(status=200)

def page(request, cat=None, sub=None):
    if request.method == "POST":
        data = json.loads(request.body)
        section_title = None
        if data['section-title']:
            section_title = data['section-title']
        for key, value in section_names.items():
            if value == data['section-name']:
                name = key
        if not cat:
            new_section = Section(page=Page.objects.get(slug="Home"), name=name, title=section_title)
        elif cat and not sub:
            new_section = Section(page=Page.objects.get(slug=cat), name=name, title=section_title)
        else:
            new_section = Section(page=Page.objects.get(slug=sub), name=name, title=section_title)
        new_section.save()
        i = 0
        for id in data["ids"]:
            Placement.objects.create(article=New.objects.get(id=int(id)), section=new_section, position=i)
            i += 1
        return HttpResponse(status=200)
    sub_categories = None
    parent = None
    if not cat:
        page = Page.objects.get(slug="Home")
        sections = page.sections.prefetch_related("articles__article")
    elif cat and not sub:
        page = Page.objects.get(slug=cat)
        sections = page.sections.prefetch_related("articles__article")
        parent = cat
        if cat != "Business":
            sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        page = Page.objects.get(slug=sub)
        sections = page.sections.prefetch_related("articles__article")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
        parent = cat
    q = request.GET.get("q")
    if (q):
        q = q.capitalize().strip()
        news = New.objects.filter(headline__contains=q)
    else:
        news = New.objects.all()
    Paginators = Paginator(news, 10)
    pagenumber = request.GET.get("p")
    all_news = Paginators.get_page(pagenumber)
    for section in sections:
        section.include = f"CS50_News/designs/_{section_names[section.name]}.html"
        section.include_name = f"CS50_News/sections/_{section_names[section.name]}.html"
    return render(request, "CS50_News/pages.html", {
        "sections": sections,
        "subs": sub_categories,
        "parent": parent,
        "all": [f"CS50_News/designs/_{name}.html" for name in section_names.values()],
        "news": all_news,
    })