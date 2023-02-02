from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/sc',consumers.MyConsumerSync.as_asgi()),
    path('ws/chat/sc/groupchat/<str:group_name>',consumers.MyConsumerDynamicSync.as_asgi()),
    path('ws/chat/ac/groupchat/<str:group_name>',consumers.MyConsumerDynamicASync.as_asgi())

]