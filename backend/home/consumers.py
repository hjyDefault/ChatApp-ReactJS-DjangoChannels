import time
from channels.consumer import SyncConsumer,AsyncConsumer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import asyncio
import json

class TestConsumer(SyncConsumer):

    def websocket_connect(self,event):
        print("Connected Web Socket")
        self.send({
            'type':'websocket.accept'
        })
    
    def websocket_receive(self,event):
        print("Message received ",event)
        for i in range(20):
            self.send({
                'type':'websocket.send',
                'text':str(i)
            })
            time.sleep(1)
    
    def websocket_disconnect(self,event):
        print("Websocket Disconnected")

class TestConsumer2(WebsocketConsumer):

    def connect(self):
        self.room_name = "test_consumer"
        self.room_group_name = "test_consumer_group"
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,self.channel_name
        )
        self.accept()
        self.send(text_data = json.dumps({'status':'connected'}))

    def receive(self):
        pass

    def disconnect(self):
        pass

    def send_notification(self,event):
        print('In send notification function')
        print(event)

class TestConsumerAsync(AsyncConsumer):

    async def websocket_connect(self,event):
        print("Connected Web Socket")
        
        await self.send({
            'type':'websocket.accept',
            'text':'received connection and accepted'
        })
    
    async def websocket_receive(self,event):
        print("Message received ",event)
        for i in range(20):
            await self.send({
                'type':'websocket.send',
                'text':str(i)
            })
            await asyncio.sleep(1)
    
    async def websocket_disconnect(self,event):
        print("Websocket Disconnected")
