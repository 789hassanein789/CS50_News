# Generated by Django 5.1.3 on 2024-12-07 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0024_new_is_featured_new_is_hero'),
    ]

    operations = [
        migrations.AddField(
            model_name='new',
            name='is_sub_hero',
            field=models.BooleanField(default=False),
        ),
    ]
