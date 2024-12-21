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
from allauth.account.decorators import reauthentication_required
import markdown
import pyotp
import json

from .models import User, New, Category
from .utils import send_otp, Rescore, short_category


# Create your views here.
def index(request, cat=None):
    Rescore(New.objects.all())
    if cat == None:
        news = New.objects.prefetch_related('category').order_by("score")
        sub_categories = None
    elif cat in ["News", "Sport", "Business", "Innovation", "Culture", "Art", "Travel", "Earth"]:
        news = New.objects.filter(category__parent=cat[0]).order_by("score")
        sub_categories = Category.objects.filter(parent=cat[0])
    else:
        short_name = short_category(cat)
        news = New.objects.filter(category__category=short_name).order_by("score")
        parent = Category.objects.get(category=short_name).parent
        sub_categories = Category.objects.filter(parent=parent)
    hero = news.filter(section="H")
    side = news.filter(section="S")
    top_stories = news.filter(section="T")
    only = news.filter(section="O")
    featured = news.filter(section="F")

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
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def admin_view(request):
    news = New.objects.filter(auther=request.user)
    return render(request, "CS50_News/admin.html", {
        "news": news
    })

def add_new(request):
    if request.method == "POST":
        headline = request.POST["headline"]
        sub_headline = request.POST["sub_headline"]
        categories = request.POST["categories"]
        content = request.POST["content"]

        try:
            image = request.FILES["img"]
            new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user)
            for category in categories:
                Category.objects.get(category=category).news.add(new)
            new.save()
        except:
            return HttpResponse({"erorr": "your form is incomplete, try resubmiting"}, status=400)
        return HttpResponseRedirect(reverse("index"))
    categories = Category.objects.all()
    return render(request, "CS50_News/add.html", {
        "categories": categories
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
    return render(request, "CS50_News/crop.html")

def new(request, id, cat=None):
    if cat == None:
        new = New.objects.get(id=id)
    else:
        short_name = short_category(cat)
        print(short_name)
        new = New.objects.prefetch_related("category", "auther").get(id=id, category__category=short_name)
    return render(request, "CS50_News/new.html", {
        "new": new
    })