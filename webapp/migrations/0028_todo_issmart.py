# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-16 09:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0027_todo_ischecked'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='IsSmart',
            field=models.IntegerField(default=0),
        ),
    ]
