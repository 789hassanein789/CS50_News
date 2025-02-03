from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from django.shortcuts import resolve_url

class MyAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_redirect_url(self, request):
        return resolve_url("/") + "?auth=settings"