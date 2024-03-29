from django.urls import path
from .views import *
urlpatterns = [
    path('index',index),
    path('index/<str:group_name>',specific_group_chat),
    path('user/allusers',get_all_users),
    path('getMessages/',get_all_messages),
    path('user/getUser',get_user),
    path('user/login',login),
    path('user/register/',register),
    path('saveMessage',save_message),
    path('user/online-users/',get_online_users)

]