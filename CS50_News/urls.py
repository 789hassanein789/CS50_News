from django.urls import path, include
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("settings", views.settings, name="settings"),
    path("admin", views.admin_view, name="admin"),
    path("add", views.add_new, name="add"),
    path("update/<slug:slug>", views.edit_new, name="update"),
    path("deletenew/", views.delete_new, name="delete-new"),
    path("save/", include([
        path("", views.save_new, name="show-saved"),
        path("<slug:headline>", views.save_new, name="save"),
    ])),
    path("crop", views.crop, name="crop"),
    path("search", views.search, name="search"),
    path("logout", views.logout_view, name="logout"),
    path("check", views.check, name="check"),
    path("delete", views.delete_account, name="delete"),
    path("edit", views.accountEdit, name="edit"),
    path("reauthenticate", views.reauthenticate_decision, name="reauthenticate"),
    path("auth", views.index, name="auth"),
    path("auth/<str:key>", views.index, name="new-password"),
    path("tags/<str:tag>", views.tag, name="tags"),
    path("page/", include([
        path("delete/<int:id>", views.delete_section, name="delete_section"),
        path("", views.page, name="page"), 
        path("placements/<str:name>", views.placements, name="placements"),
        path("placements/<str:name>/<int:id>", views.placements, name="placements"),
        path("<str:cat>/", views.page, name="page"),
        path("<str:cat>/placements/<str:name>", views.placements, name="placements"),
        path("<str:cat>/<str:sub>/", views.page, name="page"),
        path("<str:cat>/<str:sub>/placements/<str:name>", views.placements, name="placements"),
    ])),
    path("<str:cat>/", include([
        path("", views.index, name="cat_index"),
        path("<str:sub>", views.index, name="cat_index"),
        path("<str:sub>/<slug:slug>", views.new, name="new"),
    ])),
    path("password/reset/key/<str:key>", views.reset, name="password_reset"),
    path("hi", views.admin_pop),
]

