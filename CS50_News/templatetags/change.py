from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@stringfilter
def change(value, args):
    return value.replace(args[0], args[1])

register.filter("change", change)