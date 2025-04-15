import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail
from .models import New, Section

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
    #

def short_category(cat):
    cat_dict = New.SUB_CATEGORIES
    cat.replace(' ', '_')
    for v in cat_dict.values():
        for key, value in v.items():
            if value == cat:
                return key
    return

def section_recursion(position, sections):
    if sections.filter(position=position + 1).exists():
        section_recursion(position + 1, sections)
    s = sections.get(position=position)
    s.position += 1
    s.save()