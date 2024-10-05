from allauth.account.forms import SignupForm, LoginForm
from django import forms
from .models import *

class NewForm(forms.Form):
    image = forms.ImageField()

class signupForm(SignupForm):
    first_name = forms.CharField(max_length=25)
    last_name = forms.CharField(max_length=25)
    def save(self, request):
        user = super(signupForm, self).save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user
