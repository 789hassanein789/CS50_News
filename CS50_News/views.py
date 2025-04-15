from django.contrib.auth import logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django import forms
from django.shortcuts import render
from datetime import datetime
from django.core.paginator import Paginator
from allauth.account.decorators import login_required, secure_admin_login, reauthentication
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Count
from django.shortcuts import get_object_or_404
from PIL import Image
from io import BytesIO
from sys import getsizeof
from math import isclose
from taggit.models import Tag
import json
from markdown2 import Markdown

from .models import User, New, Page, Section, Placement
from .utils import short_category, section_recursion

section_names = Section.SECTIONS

def index(request, cat="Home", sub=None, key=None):
    sub_categories = None
    if not sub:
        page = get_object_or_404(Page, slug=cat)
        sections = page.sections.prefetch_related("articles__article")
        if not cat in ["Business", "Home"]:
            sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        page = get_object_or_404(Page, slug=sub)
        sections = page.sections.prefetch_related("articles__article")
        sub_categories = New.SUB_CATEGORIES[cat[0]]    
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
    })

@secure_admin_login
def add_new(request, slug=None):
    if request.method == "POST":
        if slug:
            new = New.objects.get(slug=slug)
            user = User.objects.get(id=request.user.id)
            if new.auther != request.user and not user.is_superuser:
                return HttpResponse(status=403)
        post_data = request.POST
        headline = post_data.get("headline")
        sub_headline = post_data.get("sub_headline")
        category = post_data.get("category")
        sub_category = post_data.get("sub_category")
        tags = post_data.get("tags").lower()
        content = post_data.get("content")
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
                if slug:
                    new.image = cropped_image_file
                else:
                    new = New(headline=headline, sub_headline=sub_headline, image=cropped_image_file, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=headline.replace(" ", "-"))
            else:
                if slug:
                    new.image = image
                else:
                    new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=headline.replace(" ", "-"))
        if slug:
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
           return HttpResponse({"could not create the article"}, status=400)
        return HttpResponseRedirect(reverse("admin"))
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
        return HttpResponseRedirect(reverse("admin"))
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

def tag(request, tag):
    news = New.objects.filter(tags__name__in=[tag]).order_by("timestamp")
    pagenator = Paginator(news, 10)
    pagenum = request.GET.get("p")
    news = pagenator.get_page(pagenum)
    return render(request, "CS50_News/search.html", {
        "news": news,
        "tag": tag
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

def reauthenticate_decision(request):
    if (
            request.user.is_anonymous
            or not reauthentication.did_recently_authenticate(request)
            ):
        return HttpResponse(status=401)
    else:
        return HttpResponse(status=200)

@secure_admin_login
def page(request, cat="Home", sub=None):
    sub_categories = None
    parent = None
    if not sub:
        page = Page.objects.get(slug=cat)
        sections = page.sections.prefetch_related("articles__article").order_by("position")
        parent = cat
        if not cat in ["Business", "Home"]:
            sub_categories = New.SUB_CATEGORIES[cat[0]]
    else:
        page = Page.objects.get(slug=sub)
        sections = page.sections.prefetch_related("articles__article").order_by("position")
        sub_categories = New.SUB_CATEGORIES[cat[0]]
        parent = cat
    
    for section in sections:
        section.include = f"CS50_News/designs/_{section_names[section.name]}.html"
        section.include_name = f"CS50_News/sections/_{section_names[section.name]}.html"
    q = request.GET.get("q")
    if (q):
        q = q.capitalize().strip()
        news = New.objects.filter(headline__contains=q)
    else:
        news = New.objects.all()
    Paginators = Paginator(news, 10)
    pagenumber = request.GET.get("p")
    all_news = Paginators.get_page(pagenumber)
    return render(request, "CS50_News/pages.html", {
        "sections": sections,
        "subs": sub_categories,
        "parent": parent,
        "all": [{"name": name, "include": f"CS50_News/designs/_{name}.html"}  for name in section_names.values()],
        "news": all_news,
    })

@secure_admin_login
def delete_section(request, id):
    if request.method == "POST":
        try:
            section = Section.objects.get(id=id)
            section.delete()
        except:
            return HttpResponse(status=400)
        return HttpResponseRedirect(reverse('page'))
    return HttpResponse(status=405)

@secure_admin_login
def placements(request, name, cat="Home", sub=None):
    dict_name = list(section_names.keys())[list(section_names.values()).index(name)]
    if request.method == "POST":
        selected_page = Page.objects.get(slug=cat)
        if sub:
            cat = sub
        position = request.POST.get("position")
        if request.POST.get("method") == "put":
            edit_section = Section.objects.get(page=selected_page, name=dict_name, position=position)
            if request.POST.get('title'):
                edit_section.title = request.POST.get('title')
            i = 0
            edit_section.save()
            while request.POST.get(str(i)):
                placement = Placement.objects.get(section=edit_section, position=i)
                placement.article=New.objects.get(id=request.POST.get(str(i)))
                placement.save()
                i += 1
            return HttpResponseRedirect(reverse("page"))
        else:
            sections = Section.objects.filter(page=selected_page)
            if sections.filter(position=position).exists():
                section_recursion(int(position), sections)
            new_section = Section(page=selected_page, name=dict_name, title=request.POST.get("title"), position=position)
            new_section.save()
            i = 0
            while request.POST.get(str(i)):
                Placement.objects.create(article=New.objects.get(id=request.POST.get(str(i))), section=new_section, position=i)
                i += 1
            return HttpResponseRedirect(reverse("page"))
    q = request.GET.get("q")
    if (q):
        q = q.capitalize().strip()
        news = New.objects.filter(category=cat[0], headline__contains=q)
    else:
        news = New.objects.all()
        if cat != "Home":
            news = news.filter(category=cat[0])
            if sub:
                sub_cateogry_dict = New.SUB_CATEGORIES[cat[0]]
                print(sub_cateogry_dict.values())
                sub_short_name = list(sub_cateogry_dict.keys())[list(sub_cateogry_dict.values()).index(sub)]
                news = news.filter(sub_category=sub_short_name)
        Paginators = Paginator(news, 10)
        pagenumber = request.GET.get("p")
        all_news = Paginators.get_page(pagenumber)
        if request.GET.get("edit"):
            section = Section.objects.get(page=Page.objects.get(name=cat), name=dict_name, position=request.GET.get("position"))
            section.include = f"CS50_News/designs/_{name}.html"
        else:
            section = {"include": f"CS50_News/designs/_{name}.html"}
        return render(request, "CS50_News/placements.html", {
            "section": section,
            "news": all_news,
    })
    
