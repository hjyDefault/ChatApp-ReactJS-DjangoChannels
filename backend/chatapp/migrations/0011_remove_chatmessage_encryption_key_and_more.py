# Generated by Django 4.1.5 on 2023-04-03 18:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0010_symmetrickey_alter_customuser_last_seen_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatmessage',
            name='encryption_key',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='last_seen',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 3, 23, 57, 12, 473312)),
        ),
    ]