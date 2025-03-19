from django.contrib import admin

from .models import User, New, Page, Section, Placement
# Register your models here.

class PageAdmin(admin.ModelAdmin):
  prepopulated_fields = {"slug": ["name"]}

admin.site.register(User)
admin.site.register(New)
admin.site.register(Page, PageAdmin)
admin.site.register(Section)
admin.site.register(Placement)