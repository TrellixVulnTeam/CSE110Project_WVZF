# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-04 01:25
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(max_length=40)),
                ('Description', models.CharField(max_length=160)),
                ('EstimateTime', models.IntegerField()),
                ('DueDate', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('UserName', models.CharField(max_length=20)),
                ('Email', models.CharField(max_length=30)),
                ('Password', models.CharField(max_length=20)),
                ('NotificationsFreq', models.BooleanField(default=False)),
                ('ColorScheme', models.IntegerField()),
                ('CalenderView', models.CharField(choices=[('A', 'Agenda'), ('T', 'Three-Day'), ('M', 'Month')], max_length=1)),
            ],
        ),
        migrations.AddField(
            model_name='todo',
            name='UserID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webapp.User'),
        ),
    ]
