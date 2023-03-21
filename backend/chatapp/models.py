import datetime
from django.db import models
from django.contrib.auth.models import User

class ChatMessage(models.Model):
    message_content = models.CharField(max_length=1000)
    timestamp = models.DateTimeField()
    message_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name='message_by',null=True)
    group = models.ForeignKey('Group',on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return self.message_by.username

class Group(models.Model):
    name = models.CharField(max_length=500)
    user1 = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user1',null=True)
    user2 = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user2',null=True)
    unique_id = models.CharField(max_length=500,null=True)

    def __str__(self) -> str:
        return self.name
        
class CustomUser(User):
    profilepic = models.URLField(max_length=500)
    online_status = models.BooleanField(default=False)
    last_seen = models.DateTimeField(default=datetime.datetime.now())