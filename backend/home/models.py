from django.db import models
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
# from channels.layers import 
# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    notification = models.TextField(max_length=100)
    seen = models.BooleanField(default=False)

    def save(self,*args,**kwargs):
        channel_layer = get_channel_layer()
        notifications_cnt = Notification.objects.filter(seen=False).count()
        data = {'count':notifications_cnt,'current_notification':self.notification}

        async_to_sync(channel_layer.group_send)(
            'test_consumer_group',{
                'type':'send_notification',
                'value':json.dumps(data)
            }
        )
        print('Data Saved')
        super(Notification,self).save(*args,**kwargs)
    
