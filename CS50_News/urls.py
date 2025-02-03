from django.urls import path, include
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("settings", views.settings, name="settings"),
    path("staff", views.admin_view, name="staff"),
    path("add", views.add_new, name="add"),
    path("crop", views.crop, name="crop"),
    path("search", views.search, name="search"),
    path("logout", views.logout_view, name="logout"),
    path("check", views.check, name="check"),
    path("delete", views.delete_account, name="delete"),
    path("edit", views.accountEdit, name="edit"),
    path("OTP", views.otp_view, name="otp"),
    path("reauthenticate", views.reauthenticate_decision, name="reauthenticate"),
    path("auth", views.index, name="auth"),
    path("auth/<str:key>", views.index, name="new-password"),
    path("<str:cat>/", include([
        path("", views.index, name="cat_index"),
        path("<int:id>", views.new, name="new"),
        path("<str:sub>", views.index, name="cat_index"),
    ])),
    path("password/reset/key/<str:key>", views.reset, name="password_reset"),
]

