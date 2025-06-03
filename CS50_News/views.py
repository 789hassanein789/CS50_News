from django.contrib.auth import logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.shortcuts import render
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
from .utils import short_category, section_recursion, pages_positions
from slugify import slugify

section_names = Section.SECTIONS
sub_categories = New.SUB_CATEGORIES
new_categories = New.CATEGORYS

def index(request, cat="home", sub=None, key=None):
    parent = cat.capitalize()
    if sub:
        cat = sub
    page = get_object_or_404(Page, slug=cat)
    sections = page.sections.prefetch_related("articles__article")
    for section in sections:
        section.include_name = f"CS50_News/sections/_{section_names[section.name]}.html"
    return render(request, "CS50_News/index.html", {
        "sections" : sections,
        "subs": Page.objects.filter(parent=Page.objects.get(slug=cat)),
        "parent": parent,
        "key": key,
        "cats": Page.objects.filter(parent__isnull=True)
    })

def search(request):
    q = request.GET.get("q")
    order = request.GET.get("order") or "-timestamp"
    news = New.objects.all().order_by(order)
    category = request.GET.get("cat")
    if category:
        news = news.filter(category=category[0])
    if q:
        news = news.filter(headline__contains=q.strip())
    Paginators = Paginator(news, 10)
    pagenumber = request.GET.get("p")
    all_news = Paginators.get_page(pagenumber)
    return render(request, "CS50_News/search.html", {
        "news": all_news,
        "categories": new_categories.values(),
        "count": news.count()
    })

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@secure_admin_login
def staff_view(request):
    users = User.objects.all()
    q = request.GET.get("q")
    up = request.GET.get("up") or 1
    np = request.GET.get("np") or 1
    if (q):
        users = users.filter(username=q.strip())
    users = users.order_by("id")
    paginator = Paginator(users, 10)
    page_users = paginator.get_page(up)
    news = New.objects.filter(auther=request.user).order_by("-timestamp")
    news_paginator = Paginator(news, 20)
    page_news = news_paginator.get_page(np)
    # to remove
    for n in news:
        n.cats = [cat for cat in new_categories]
        n.list = [sub for sub in sub_categories[n.category[0]].values()]
    return render(request, "CS50_News/staff.html", {
        "news": page_news,
        "users": page_users,
    })

@secure_admin_login
def categories(request, slug, cat, sub=None):
    if request.method == "POST":
        new = New.objects.get(slug=slug)
        new.category = cat[0]
        new.sub_category = list(sub_categories[cat[0]])[0]
        if sub:
            short_name = list(sub_categories[cat[0]].keys())[list(sub_categories[cat[0]].values()).index(sub)]
            new.sub_category = short_name
        new.save()
        return HttpResponseRedirect(reverse("staff"))

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
            if abs(w / h - aspect_ratio) > 0.01:
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
                img.show()

                img_io = BytesIO()
                img.save(img_io, "PNG")  # Change format if necessary
                img_io.seek(0)

                cropped_image_file = InMemoryUploadedFile(
                img_io,
                field_name="image",
                name=image.name,
                content_type="image/png",
                size=getsizeof(img_io),
                charset=None
                )
                new = New(headline=headline, sub_headline=sub_headline, image=cropped_image_file, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=slugify(headline))
            else:
                new = New(headline=headline, sub_headline=sub_headline, image=image, content=content, auther=request.user, category=category[0], sub_category=short_name, slug=slugify(headline))
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
        new.slug=slugify(headline)
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
        return HttpResponseRedirect(reverse("staff"))
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

@secure_admin_login
def delete_user_account(request):
    if request.method == "POST":
        selected_users_ids = request.POST.getlist("selected-users")
        users = User.objects.filter(id__in=selected_users_ids)
        for user in users:
            try:
                user.delete()
            except IntegrityError:
                return HttpResponse(status=404)
        return HttpResponseRedirect(reverse("staff"))
    return HttpResponseRedirect(reverse("staff"))

@secure_admin_login
def user_management(request):
    if request.method == "POST":
        operation = request.POST.get("action")
        selected_users_ids = request.POST.getlist("selected-users")
        selected_users = User.objects.filter(id__in=selected_users_ids)
        adminBool = operation == "admin"
        staffBool = operation == "staff" or adminBool
        for user in selected_users:
            try:
                user.is_superuser = adminBool
                user.is_staff = staffBool
                user.save()
            except IntegrityError:
                return HttpResponseRedirect(reverse("staff"))
        return HttpResponseRedirect(reverse("staff"))
    return HttpResponseRedirect(reverse("staff"))

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

def new(request, cat, slug):
    try:
        news = New.objects.prefetch_related("auther").get(slug=slug, category=cat[0])
    except New.DoesNotExist:
        return HttpResponse({"error": "there is no such article"}, status=404)
    user = None
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id).saved_articles.filter(id=news.id).exists()
    related =  news.tags.similar_objects()[:6]
    markdown = Markdown()
    if news.content:
        news.content = markdown.convert(news.content)
    return render(request, "CS50_News/new.html", {
        "new": news,
        "relatedNews": related,
        "tags": news.tags.names(),
        "saved": user,
    })

def tag(request, tag):
    news = New.objects.filter(tags__name__in=[tag]).order_by("-timestamp")
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
    news = User.objects.get(id=request.user.id).saved_articles.all().order_by("-timestamp")
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
def page(request, cat="home", sub=None):
    if request.method == "POST":
        if request.POST.get("method") == "delete":
            try:
                page = Page.objects.get(slug=request.POST.get("name"))
                page.delete()
            except:
                return HttpResponse(status=404)
            return HttpResponseRedirect(reverse("page"))
        parent_name = request.POST.get("parent")
        name = request.POST.get("name")
        position = request.POST.get("position")
        try:
            parent = Page.objects.get(slug=parent_name)
        except Page.DoesNotExist:
            parent = None
        pages_positions(int(position), parent)
        try:
            page = Page(name=name, slug=name, position=position, parent=parent)
            page.save()
        except:
            return HttpResponse(status=400)
        return HttpResponseRedirect(reverse("page"))       
    if not sub:
        page = Page.objects.get(slug=cat)
        subs = Page.objects.filter(parent=page)
    else:
        page = Page.objects.get(slug=sub)
        subs = Page.objects.filter(parent=Page.objects.get(slug=cat))

    sections = page.sections.prefetch_related("articles__article").order_by("position")
    for section in sections:
        section.include = f"CS50_News/designs/_{section_names[section.name]}.html"
        section.include_name = f"CS50_News/sections/_{section_names[section.name]}.html"
    q = request.GET.get("q")
    if (q):
        q = q.capitalize().strip()
        news = New.objects.filter(headline__contains=q)
    else:
        news = New.objects.all()
    news = news.order_by("-timestamp")
    Paginators = Paginator(news, 10)
    pagenumber = request.GET.get("p")
    all_news = Paginators.get_page(pagenumber)
    return render(request, "CS50_News/pages.html", {
        "sections": sections,
        "subs": subs,
        "all": [{"name": name, "include": f"CS50_News/designs/_{name}.html"}  for name in section_names.values()],
        "news": all_news,
        "cats": Page.objects.filter(parent__isnull=True)
    })

@secure_admin_login
def delete_section(request, id):
    if request.method == "POST":
        try:
            section = Section.objects.get(id=id)
            section.delete()
        except:
            return HttpResponse(status=400)
        return HttpResponseRedirect(reverse("page"))
    return HttpResponse(status=405)

@secure_admin_login
def placements(request, name, cat="home", sub=None):
    if not [k for k, v in section_names.items() if v == name]:
        return JsonResponse({"error": "there is not such section design"}, status=400)
    dict_name = list(section_names.keys())[list(section_names.values()).index(name)]
    if request.method == "POST":
        if sub:
            selected_page = Page.objects.get(slug=sub)
        else:
            selected_page = Page.objects.get(slug=cat)
        position = request.POST.get("position")
        if request.POST.get("method") == "put":
            edit_section = Section.objects.get(page=selected_page, name=dict_name, position=position)
            if request.POST.get('title'):
                edit_section.title = request.POST.get('title')
            edit_section.save()
            i = 0
            while str(i) in request.POST:
                print(i)
                new_id = request.POST.get(str(i))
                if new_id:
                    if Placement.objects.filter(section=edit_section, position=i).exists():
                        placement = Placement.objects.get(section=edit_section, position=i)
                        placement.article = New.objects.get(id=new_id)
                    else:
                        placement = Placement(article=New.objects.get(id=new_id), section=edit_section, position=i)
                    placement.save()
                i += 1
        else:
            sections = Section.objects.filter(page=selected_page)
            if sections.filter(position=position).exists():
                section_recursion(int(position), sections)
            new_section = Section(page=selected_page, name=dict_name, title=request.POST.get("title"), position=position)
            new_section.save()
            i = 0
            while str(i) in request.POST:
                if request.POST.get(str(i)):
                    Placement.objects.create(article=New.objects.get(id=request.POST.get(str(i))), section=new_section, position=i)
                i += 1
        kwargs = {"cat": cat}
        if sub:
            kwargs["sub"] = sub
        return HttpResponseRedirect(reverse("page", kwargs=kwargs))
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        q = request.GET.get("q")
        category = request.GET.get("cat")
        news = New.objects.all()
        if category:
            news = news.filter(category=category[0])
        if q:
            q = q.capitalize().strip()
            news = New.objects.filter(headline__contains=q)
        news = news.order_by("-timestamp")
        p = request.GET.get("p")
        paginator = Paginator(news, 10)
        pagenumber = request.GET.get("p")
        requested_news = paginator.get_page(pagenumber)
        news_data = [
            {
                "id": n.id,
                "headline": n.headline,
                "sub_headline": n.sub_headline,
                "image": n.image.url if n.image else None,
                "timestamp": n.timesince(),
                "sub": n.get_sub_category_display(),
            }
            for n in requested_news
            ]
        return JsonResponse({"news": news_data, "next": requested_news.has_next(), "previous": requested_news.has_previous(), "current_page": p, "num_pages": paginator.num_pages, "start": requested_news.start_index(), "end": requested_news.end_index(), "count": paginator.count}, safe=False)
    order = request.GET.get("order") or "-timestamp"
    news = New.objects.all().order_by(order)
    p = request.GET.get("p") or 1
    category = request.GET.get("category")
    if category:
        news = news.filter(category=category[0])
    if request.GET.get("edit"):
        section = Section.objects.get(page=Page.objects.get(slug=cat), name=dict_name, position=request.GET.get("position"))
        section.include = f"CS50_News/designs/_{name}.html"
    else:
        section = {"include": f"CS50_News/designs/_{name}.html"}
    paginator = Paginator(news, 10)
    all_news = paginator.get_page(p)
    
    return render(request, "CS50_News/placements.html", {
        "section": section,
        "news": all_news,
        "count": news.count(),
        "categories": new_categories.values(),
    })