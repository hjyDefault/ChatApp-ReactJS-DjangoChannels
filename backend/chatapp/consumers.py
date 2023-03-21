import datetime
from channels.consumer import SyncConsumer,AsyncConsumer

from chatapp.serializers import UserSerializer
from .models import CustomUser
from asgiref.sync import async_to_sync
import json
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

from chatapp.models import ChatMessage, Group 
class MyConsumerSync(SyncConsumer):

    def websocket_connect(self,event):
        print('Websocket connected')
        # print('Channel layer : ',self.channel_layer) # Gets the channel layer
        # print('Channel name : ',self.channel_name) # Gets the channel name

        # Add the current channel in the group called friends
        async_to_sync(self.channel_layer.group_add)('friends',self.channel_name)
        # But the group_add function is an asynchronous which cannot work so we have to make it synchronous
        # Now if we open 3 instances of the app and call this consumer with the url then all those 3 instance will be add
        # to the group called friends

        # If a message is sent from any instance to the group then it will be received by all 3 



        self.send({
            'type':'websocket.accept'
        })
    
    def websocket_receive(self,event):
        print('Websocket Receiving..',event)
        # Note that this group name is static 
        # In other consumer I have created dynamic group name
        async_to_sync(self.channel_layer.group_send)('friends',{
            'type':'chat.message',
            'message':event['text']
        })

    def chat_message(self,event):
        print("In chat message : ",event)
        self.send({
            'type':'websocket.send',
            'text':event['message']
        })


    def websocket_disconnect(self,event):
        print('Websocket connection closed')
        async_to_sync(self.channel_layer.group_discard)('friends',self.channel_name)

class MyConsumerDynamicSync(SyncConsumer):

    def websocket_connect(self,event):
        print('Websocket connected')
        # print(self.scope['url_route']['kwargs']['group_name'])

        self.group_name = self.scope['url_route']['kwargs']['group_name']

        # print('Channel layer : ',self.channel_layer) # Gets the channel layer
        # print('Channel name : ',self.channel_name) # Gets the channel name

        # Add the current channel in the group called friends
        async_to_sync(self.channel_layer.group_add)(self.group_name,self.channel_name)
        # But the group_add function is an asynchronous which cannot work so we have to make it synchronous
        # Now if we open 3 instances of the app and call this consumer with the url then all those 3 instance will be add
        # to the group called friends

        # If a message is sent from any instance to the group then it will be received by all 3 
        self.send({
            'type':'websocket.accept'
        })
    
    def websocket_receive(self,event):
        print('Websocket Receiving..',event)
        data = json.loads(event['text'])
        print('Chat Message : ',data['msg'])

        group = Group.objects.get(name=self.group_name)
        chat = ChatMessage(msg_content=data['msg'],group=group)
        chat.save()
        
        async_to_sync(self.channel_layer.group_send)(self.group_name,{
            'type':'chat.message',
            'message':event['text']
        })

    def chat_message(self,event):
        print("In chat message : ",event)
        self.send({
            'type':'websocket.send',
            'text':event['message']
        })


    def websocket_disconnect(self,event):
        print('Websocket connection closed')
        async_to_sync(self.channel_layer.group_discard)(self.group_name,self.channel_name)

class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self,event):
        print('Websocket connected')
        # print(self.scope['url_route']['kwargs']['group_name'])

        self.group_name = self.scope['url_route']['kwargs']['group_name']

        # print('Channel layer : ',self.channel_layer) # Gets the channel layer
        # print('Channel name : ',self.channel_name) # Gets the channel name

        await self.channel_layer.group_add(self.group_name,self.channel_name)
        
        await self.send({
            'type':'websocket.accept'
        })
    
    async def websocket_receive(self,event):
        print('Websocket Receiving..',event)
        json_incoming_data = json.loads(event['text'])

        if json_incoming_data['msg']['message_type']=='userMessage':
            message_object = {
                'message_type':'userMessage',
                'message_content':json_incoming_data['msg']['text'],
                'message_by':json_incoming_data['msg']['message_by'],
                'received_by':json_incoming_data['msg']['received_by'],
                'timestamp':str(datetime.datetime.now())
            }
        else :
            message_object = {
                'message_type':'typing',
                'user':json_incoming_data['msg']['user'],
                'typing':json_incoming_data['msg']['typing']
            }
        await self.channel_layer.group_send(self.group_name,{
            'type':'chat.message',
            'message':json.dumps(message_object)
        })

    async def chat_message(self,event):
        print("In chat message of async : ",event)
        await self.send({
            'type':'websocket.send',
            'text':event['message']
        })


    async def websocket_disconnect(self,event):
        print('Websocket connection closed')
        await self.channel_layer.group_discard(self.group_name,self.channel_name)
    
class OnlineStatusConsumer(AsyncConsumer):

    async def websocket_connect(self,event):
        self.group_name = "Online_Users"
        print("Adding user to online users")
        await self.channel_layer.group_add(self.group_name,self.channel_name)
        await self.send({
            'type':'websocket.accept'
        })

    async def websocket_disconnect(self,event):
        print("Removing user to online users")
        # print(self.channel_name)
        await self.change_online_status(self.userid,"CLOSE")
        await self.channel_layer.group_discard(self.group_name,self.channel_name)

    async def websocket_receive(self,event):
        json_incoming_data = json.loads(event['text'])
        connection_type = json_incoming_data['type']
        userid = json_incoming_data['userid']
        self.userid = userid
        await self.change_online_status(userid,connection_type)

    @database_sync_to_async
    def change_online_status(self,userid,connection_type):
        customuser = CustomUser.objects.get(id=userid)
        if connection_type == 'OPEN':
            print('Changing Status to Online')
            customuser.online_status = True
            customuser.save()
        else : 
            print('Changing Status to Offline')
            customuser.online_status = False
            customuser.last_seen = datetime.datetime.now()
            customuser.save()


    async def send_user_status(self,event):
        data = json.loads(event.get('value'))
        userid = data['user_id']
        online_status = data['user_status']
        username = data['user_name']
        await self.send({
            'type':'websocket.send',
            'text':json.dumps({'user_id':userid, 'user_status': online_status, 'user_name':username})})
        
