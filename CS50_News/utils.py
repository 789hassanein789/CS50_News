from .models import New, Page
from re import sub

def Rescore(news):
    for new in news:
        new.score = new.views / new.timesince()
        new.save()
    return 

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

def slugify(string):
    s = string.lower().strip()
    s = sub(r'[^\w\s-]', '', s)
    s = sub(r'[\s_-]+', '-', s)
    s = sub(r'^-+|-+$', '', s)
    return s

def pages_positions(position, parent=None):
    if Page.objects.filter(position=str(position), parent=parent).exists():
        pages_positions(position + 1, parent)
        for page in Page.objects.filter(position=position, parent=parent):
            page.position += 1
            page.save()