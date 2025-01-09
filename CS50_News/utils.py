import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail
from .models import New

def send_otp(request):
    totp = pyotp.TOTP(pyotp.random_base32(), interval=360)
    otp = totp.now()
    request.session["otp_secret_key"] = totp.secret
    valid_date = datetime.now() + timedelta(minutes=1)
    request.session["otp_valid_until"] = str(valid_date)
    print(otp)
    #send_mail (
    #    "Your one time password from CS50 News",
    #    f"Your one time password is {otp}",
    #    "hassanein582@gmail.com",
    #    [request.user.email], 
    #    fail_silently=False
    #)

def Rescore(news):
    for new in news:
        new.score = new.views / new.timesince()
        new.save()
    return 

def short_category(cat):
    cat_dict = New.SUB_CATEGORIES
    cat = cat.capitalize()
    cat.replace(' ', '_')
    short_name = ""
    for k, v in cat_dict.items():
        print(k, v)
        for key, value in v.items():
            print(key, value)
            if value == cat:
                print("happend")
                short_name = key
    return short_name