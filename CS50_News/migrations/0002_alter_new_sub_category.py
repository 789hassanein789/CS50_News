# Generated by Django 5.1 on 2024-08-30 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CS50_News', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='new',
            name='sub_category',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
    ]