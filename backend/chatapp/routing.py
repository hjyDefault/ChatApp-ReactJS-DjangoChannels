from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('wss/chat/sc',consumers.MyConsumerSync.as_asgi()),
    path('wss/chat/sc/groupchat/<str:group_name>',consumers.MyConsumerDynamicSync.as_asgi()),
    path('wss/chat/ac/groupchat/<str:group_name>',consumers.ChatConsumer.as_asgi()),
    path('wss/chat/ac/online_status/',consumers.OnlineStatusConsumer.as_asgi())
]