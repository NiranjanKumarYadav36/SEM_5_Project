# Generated by Django 5.1.1 on 2024-09-24 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wild_life', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='identifications',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_login',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
