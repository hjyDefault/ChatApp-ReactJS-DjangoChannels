from rest_framework import serializers
from .models import ChatMessage, CustomUser, Group

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta :
        model = ChatMessage
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields=['id','username','profilepic','online_status']
        
