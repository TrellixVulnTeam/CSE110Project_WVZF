# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-15 06:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0026_todo_isscheduled'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='IsChecked',
            field=models.IntegerField(default=0),
        ),
    ]
