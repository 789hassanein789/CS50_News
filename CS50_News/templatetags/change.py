from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@stringfilter
def change(value, args):
    return value.replace(args[0], args[1])

def create_list(string):
    return string.split()

@register.simple_tag
def custom_range(s, e):
    return range(s, e)

@register.filter
def index(sequence, position):
    try:
        return sequence[int(position)]
    except (IndexError, ValueError, TypeError):
        return None

@register.filter
def position(sequence, position):
    for query in sequence:
        if query.position == position:
            return query

register.filter("change", change)
register.filter("create_list", create_list)