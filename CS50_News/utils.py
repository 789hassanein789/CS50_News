import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail

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