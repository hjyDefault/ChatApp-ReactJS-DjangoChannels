"""
ASGI config for channels_demo project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter,URLRouter
import home.routing
import chatapp.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'channels_demo.settings')

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket':URLRouter([*chatapp.routing.websocket_urlpatterns,
                           *home.routing.websocket_urlpatterns])
})

