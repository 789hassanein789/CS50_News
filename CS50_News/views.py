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
from datetime import datetime, timezone, timedelta
from allauth.account.decorators import reauthentication_required
import pyotp
import json

from .models import User, New
from .utils import send_otp


# Create your views here.
def index(request, cat="Main"):
    if cat == "Main":
        news = New.objects.all()
    elif cat in ["News", "Sport", "Business", "Innovation"]:
        news = New.objects.filter(category=cat)
    else:
        news = New.objects.filter(sub_category=cat)
    return render(request, "CS50_News/index.html", {
        "news" : news
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

def add_new(request):
    if request.method == "POST":
        headline = request.POST["headline"]
        content = request.POST["content"]
        category = request.POST["category"]
        auther = User.objects.get(id=request.user.id)
        image = request.FILES.get("image")
        N = New(headline=headline, image=image, content=content, category=category, auther=auther)
        N.save()
        return HttpResponseRedirect(reverse("index"))
    return render(request, "CS50_News/add.html")

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

