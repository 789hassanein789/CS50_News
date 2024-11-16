from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add_new, name="add"),
    path("crop", views.crop, name="crop"),
    path("saerch", views.search, name="search"),
    path("logout", views.logout_view, name="logout"),
    path("check", views.passwordCheck, name="check"),
    path("delete", views.Delete, name="delete"),
    path("edit", views.accountEdit, name="edit"),
    path("OTP", views.otp_view, name="otp"),
    path("<str:category>", views.index, name="cat_index"),
    
]

