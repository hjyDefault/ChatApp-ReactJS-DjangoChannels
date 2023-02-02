# Generated by Django 4.1.5 on 2023-01-31 16:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chatapp', '0005_group_user1_group_user2'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chatmessage',
            old_name='msg_content',
            new_name='message_content',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='message_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='message_by', to=settings.AUTH_USER_MODEL),
        ),
    ]