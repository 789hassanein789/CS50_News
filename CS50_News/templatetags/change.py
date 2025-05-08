from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@stringfilter
def change(value, args):
    return value.replace(args[0], args[1])

def create_list(string):
    return string.split()

register.filter("change", change)
register.filter("create_list", create_list)