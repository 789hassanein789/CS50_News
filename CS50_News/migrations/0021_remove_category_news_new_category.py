# Generated by Django 5.1.3 on 2024-12-07 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0020_alter_category_news'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='news',
        ),
        migrations.AddField(
            model_name='new',
            name='category',
            field=models.ManyToManyField(related_name='news', to='CS50_News.category'),
        ),
    ]