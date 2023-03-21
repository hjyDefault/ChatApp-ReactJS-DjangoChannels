import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save,sender=CustomUser)
def send_online_status(sender,instance,created,**kwargs):

    if not created :
        channel_layer = get_channel_layer()
        username = instance.username
        userid = instance.id

        user_status = instance.online_status

        data = {
            'user_id':userid,
            'user_status':user_status,
            'user_name':username
        }

        async_to_sync(channel_layer.group_send)('Online_Users',{
            'type':'send_user_status',
            'value':json.dumps(data)
        })
        