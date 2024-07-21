from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django import forms
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

from .models import User, New

class NewForm(forms.Form):
    image = forms.ImageField()

# Create your views here.
def index(request, cat="Main"):
    if cat == "Main":
        news = New.objects.all().order_by("-timestamp")
    elif cat in ["News", "Sport", "Business", "Innovation"]:
        news = New.objects.filter(category=cat).order_by("-timestamp")
    else:
        news = New.objects.filter(sub_category=cat).order_by("-timestamp")
    return render(request, "CS50_News/index.html", {
        "news" : news
    })

def login_view(request):
    if request.method == "POST":
        user = authenticate(request, username=request.POST["username"], password=request.POST["password"])
        if user:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "CS50_News/login.html", {
                "message": "invalid username and/or password"
            })
    else:
        return render(request, "CS50_News/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")
        if password != confirmation:
            return render(request, "CS50_News/register.html", {
                "message": "the password dosen't match the confirmation"
            })
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "CS50_News/register.html", {
                "message": "the username is already taken"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "CS50_News/register.html")

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

def crop(request):
    return render(request, "CS50_News/crop.html")