from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/sc/',consumers.TestConsumer.as_asgi()),
    path('ws/ac/',consumers.TestConsumerAsync.as_asgi()),
    path('ws/test2/',consumers.TestConsumer2.as_asgi())
]