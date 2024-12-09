from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@stringfilter
def change(value, args):
    return value.replace(args[0], args[1])

def timeformat(value):
    if len(value) > 0:
        if value[0] == "0":
            return "now"
    for i, s in enumerate(value):
        if s == ',':
            return f"{value[:i]}&nbspago"
    return f"{value}&nbspago"

register.filter("change", change)
register.filter("timeformat", timeformat)