from django.urls import path
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
    path("new/<int:id>", views.new, name="new"),
    path("cat/<str:cat>", views.index, name="cat_index"),
]

