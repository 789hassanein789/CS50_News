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

from .models import User, New
from .utils import send_otp, Rescore, short_category


def index(request, cat=None, sub=None, key=None):
    Rescore(New.objects.all())
    parent = None
    sub_categories = None
    if cat == None:
        news = New.objects.all().order_by("score")
    # make sure the cat is valid.
    elif cat and not sub:
        news = New.objects.filter(category=cat[0]).order_by("score")
        if cat != "Business":
            sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        short_name = short_category(sub)
        news = New.objects.filter(sub_category=short_name).order_by("score")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
    # TODO: filter on category not just section
    hero = news.filter(section="H")
    side = news.filter(section="S")
    top_stories = news.filter(section="T")
    only = news.filter(section="O")
    featured = news.filter(section="F")
    #

    return render(request, "CS50_News/index.html", {
        "news" : news,
        "hero": hero,
        "side": side,
        "top_stories": top_stories,
        "only": only,
        "featured": featured,
        "subs": sub_categories,
        "parent": cat,
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
        "news": New.objects.filter(auther=request.user),
        "users": User.objects.all()
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
        try:
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
                    new = New(headline=headline, sub_headline=sub_headline, image=cropped_image_file, content=content, auther=request.user, category=category[0], sub_category=short_name)
                    new.save()
                else:
                    new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user, category=category[0], sub_category=short_name)
                    new.save()
        except:
           return HttpResponse("could not open the image", status=400)
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
        "suggestions": suggestions
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

def new(request, cat, id):
    try:
        news = New.objects.prefetch_related("auther").get(id=id, category=cat[0])
    except New.DoesNotExist:
        return HttpResponse({"error": "there is no article with such id"}, status=400)
    related =  news.tags.similar_objects()

    return render(request, "CS50_News/new.html", {
        "new": news,
        "relatedNews": related,
        "tags": news.tags.names()
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

class CustomConfirmCode(ConfirmEmailVerificationCodeView):
    def form_valid(self, form):
        response = super().form_valid(form)
        return JsonResponse({
            "message": "Email confirmed successfully!",
            "redirect_url": reverse('home') + "?auth=confirm-email"
        })