# Generated by Django 5.1 on 2024-09-03 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0003_alter_new_auther'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='new',
            name='timestamp',
        ),
        migrations.AlterField(
            model_name='new',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to="{% static 'CS50_News/covers' %}"),
        ),
    ]