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
from allauth.account.decorators import reauthentication_required, login_required, verified_email_required, secure_admin_login
from django.contrib.admin.views.decorators import staff_member_required
from PIL import Image
import pyotp
import json

from .models import User, New
from .utils import send_otp, Rescore, short_category


# Create your views here.
def index(request, cat=None):
    Rescore(New.objects.all())
    if cat == None:
        news = New.objects.all().order_by("score")
        sub_categories = None
    elif cat in ["News", "Sport", "Business", "Innovation", "Culture", "Art", "Travel", "Earth"]:
        news = New.objects.filter(category=cat[0]).order_by("score")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        short_name = short_category(cat)
        news = New.objects.filter(category=short_name).order_by("score")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
    hero = news.filter(section="H")
    side = news.filter(section="S")
    top_stories = news.filter(section="T")
    only = news.filter(section="O")
    featured = news.filter(section="F")
    print(sub_categories)

    return render(request, "CS50_News/index.html", {
        "news" : news,
        "hero": hero,
        "side": side,
        "top_stories": top_stories,
        "only": only,
        "featured": featured,
        "subs": sub_categories
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
    news = New.objects.filter(auther=request.user)
    return render(request, "CS50_News/admin.html", {
        "news": news
    })

@secure_admin_login
def add_new(request):
    if request.method == "POST":
        headline = request.POST.get("headline")
        sub_headline = request.POST.get("sub_headline")
        category = request.POST.get("category")
        sub_category = request.POST.get("sub_category")
        tags = request.POST.get("tags")
        content = request.POST.get("content")
        image = request.FILES.get("blob")
        short_name = short_category(sub_category)
        try:
            with Image.open(image) as img:
                w, h = img.size
                if w / h != 16 / 9:
                    newh = w*9/16
                    img.crop((0, (h/2-newh/2), w, (h/2+newh/2)))
                    print("crop")
        except:
            return HttpResponse({"error": "please provied an image"}, status=400)
        try:
            new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user, category=category[0], sub_category=short_name)
            new.save()
            new.tags.add(tags)
            new.save()
        except:
           return HttpResponse({"error": "could not create the article"}, status=400)
        return HttpResponseRedirect(reverse("staff"))
    return render(request, "CS50_News/editor.html", {
        "categories": New.CATEGORYS.values(),
        "subs": New.SUB_CATEGORIES
    })

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
        if otp_secret_key and otp_secret_key:
            valid_until = datetime.fromisoformat(otp_valid_util)
            if valid_until > datetime.now():
                totp = pyotp.TOTP(otp_secret_key, interval=360)
                if totp.now() == otp:
                    user = User.objects.get(id=request.user.id)
                    user.otp_date = datetime.now(timezone.utc)
                    return HttpResponse(status=200)
                return HttpResponse(status=401)
            return HttpResponse(status=408)
        return HttpResponse(status=500)
    send_otp(request)
    return HttpResponse(status=200)

@reauthentication_required
def Delete(request):
    if request.method == "POST":
        try:
            user = User.objects.get(id=request.user.id)
            user.delete()
            return redirect("/")
        except User.DoesNotExist:
            return HttpResponse({"error":"There is no such account, please reload the page and try again"}, status=500)
    return HttpResponse({"error":"bad request method"}, status=400)

@reauthentication_required
def accountEdit(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.get(id=request.user.id)
        user.username = data.get("username")
        user.first_name = data.get("first-name")
        user.last_name = data.get("last-name")
        user.save()
        return HttpResponse(status=200)
    return HttpResponse(status=403)

def crop(request):
    if request.method == 'POST':
        blob = request.FILES.get('blob')
        print(blob)
        print(blob.name)
        return HttpResponse(200)
    return render(request, "CS50_News/crop.html")

def new(request, id, cat=None):
    if cat == None:
        news = New.objects.get(id=id)
    else:
        short_name = short_category(cat)
        print(short_name)
        news = New.objects.prefetch_related("category", "auther").get(id=id, category__category=short_name)
        related =  New.objects.prefetch_related("category").filter(category__category=short_name).exclude(id=id).order_by('score')
        Related = []
        score = 0
        for r in related:
            #check how many categories are related
            i = 0
            for cat in news.category.all():
                if cat in r.category.all():
                    i += 1
            if i >= score:
                score = i
                Related.append(r)
        print(Related)
        print(Related[-3:])

    return render(request, "CS50_News/new.html", {
        "new": news,
        "RelatedNews": Related[-3:]
    })