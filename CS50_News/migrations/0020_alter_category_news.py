# Generated by Django 5.1.3 on 2024-12-07 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0019_rename_featured_new_is_featured_new_is_hero'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='news',
            field=models.ManyToManyField(blank=True, related_name='category', to='CS50_News.new'),
        ),
    ]
