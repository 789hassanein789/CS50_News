from django.urls import path, include
from . import views



urlpatterns = [
    path("", views.index, name="index"),
    path("staff/", include([
        path("", views.staff_view, name="staff"),
        path("page/", include([
            path("", views.page, name="page"), 
            path("placements/<str:name>", views.placements, name="placements"),
            path("placements/<str:name>/<int:id>", views.placements, name="placements"),
            path("delete/<int:id>", views.delete_section, name="delete_section"),
            path("<str:cat>/", views.page, name="page"),
            path("<str:cat>/placements/<str:name>", views.placements, name="placements"),
            path("<str:cat>/<str:sub>/", views.page, name="page"),
            path("<str:cat>/<str:sub>/placements/<str:name>", views.placements, name="placements"),
        ])),
        path("add/", include([
            path("", views.add_new, name="add"),
            path("<slug:slug>", views.edit_new, name="update"),
            path("<slug:slug>/<str:cat>", views.categories, name="categories"),
            path("<slug:slug>/<str:cat>/<str:sub>", views.categories, name="categories"),
        ])),
    ])),
    path("deletenew/", views.delete_new, name="delete-new"),
    path("save/", include([
        path("", views.save_new, name="show-saved"),
        path("<slug:headline>", views.save_new, name="save"),
    ])),
    path("search", views.search, name="search"),
    path("logout", views.logout_view, name="logout"),
    path("delete", views.delete_account, name="delete"),
    path("delete-user", views.delete_user_account, name="delete-user"),
    path("user-management", views.user_management, name="user-management"),
    path("edit", views.accountEdit, name="edit"),
    path("reauthenticate", views.reauthenticate_decision, name="reauthenticate"),
    path("auth", views.index, name="auth"),
    path("auth/<str:key>", views.index, name="new-password"),
    path("tags/<str:tag>", views.tag, name="tags"),
    path("<str:cat>/", include([
        path("", views.index, name="cat_index"),
        path("<str:sub>", views.index, name="cat_index"),
        path("<str:sub>/<slug:slug>", views.new, name="new"),
    ])),
]

