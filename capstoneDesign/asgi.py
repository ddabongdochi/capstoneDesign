"""
ASGI config for capstoneDesign project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""
#
# import os
#
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capstoneDesign.settings')
#
# # application = get_asgi_application()
#
# application = ProtocolTypeRouter({
#     'http': get_asgi_application()
# })

# asgi.py
# import os
#
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import chat.routing


import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import yourapp.routing


# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "capstoneDesign.settings")
#
# application = ProtocolTypeRouter({
#     'http': get_asgi_application(),
#     'websocket':AuthMiddlewareStack(
#         URLRouter(
#             chat.routing.websocket_urlpatterns
#         )
#     )
# })

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yourproject.settings")

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  # WebSocket chat handler를 여기에 추가할 수 있습니다.
  "websocket": AuthMiddlewareStack(
        URLRouter(
            yourapp.routing.websocket_urlpatterns
        )
    ),
})