from django.contrib import admin

from .models import User, New, Category
# Register your models here.
admin.site.register(User)
admin.site.register(New)
admin.site.register(Category)
