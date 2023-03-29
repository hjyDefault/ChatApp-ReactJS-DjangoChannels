import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser,ChatMessage
from .serializers import UserSerializer

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
        
@receiver(post_save,sender=ChatMessage)
def send_message_to_user(sender,instance,created,**kwargs):
    print('Inside signal')
    channel_layer = get_channel_layer()

    data = {
        'unique_group_name':instance.group.name,
        'message_content':instance.message_content,
        'timestamp':instance.timestamp,
        'message_by':((UserSerializer(instance.message_by)).data),
        'message_type':instance.message_type,
        'file_type':instance.file_type
    }

   

    async_to_sync(channel_layer.group_send)(instance.group.name,{
            'type':'send_chat_message',
            'value':json.dumps(data)
        })

    
