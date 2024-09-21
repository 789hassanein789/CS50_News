from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add_new, name="add"),
    path("crop", views.crop, name="crop"),
    path("saerch", views.search, name="search"),
    path("registre", views.register, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("category/<str:cat>", views.index, name="cat_index"),
    path("check", views.passwordCheck, name="check"),
    path("delete", views.Delete, name="delete"),
    path("account", views.accountEdit, name="account"),
    path("OTP", views.otp_view, name="otp")
]

