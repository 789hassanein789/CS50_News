# Generated by Django 5.1 on 2024-09-12 13:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0004_remove_new_timestamp_alter_new_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='new',
            name='auther',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='publishes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='new',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='CS50_News/static/CS50_News/cover'),
        ),
    ]