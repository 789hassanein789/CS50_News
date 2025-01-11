from django.urls import path, include
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("staff", views.admin_view, name="staff"),
    path("add", views.add_new, name="add"),
    path("crop", views.crop, name="crop"),
    path("saerch", views.search, name="search"),
    path("logout", views.logout_view, name="logout"),
    path("check", views.passwordCheck, name="check"),
    path("delete", views.Delete, name="delete"),
    path("edit", views.accountEdit, name="edit"),
    path("OTP", views.otp_view, name="otp"),
    path("<str:cat>/", include([
        path("", views.index, name="cat_index"),
        path("<int:id>", views.new, name="new"),
        path("<str:sub>", views.index, name="cat_index"),
    ])),
]

