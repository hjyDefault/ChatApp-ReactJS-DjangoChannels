import datetime
import json
from rest_framework.parsers import JSONParser
from django.shortcuts import render
from django.core.files.storage import default_storage
from .models import CustomUser, Group,ChatMessage,SymmetricKey
from django.views.decorators.csrf import csrf_exempt
from .serializers import ChatMessageSerializer, UserSerializer
from django.contrib.auth.models import User
from django.http import JsonResponse
from .utils import get_file_extension,generate_random_string,get_file_name_without_extension
from .constants import BASE_SERVER_MEDIA_URL
import random
from django.contrib.auth import authenticate
# Create your views here.
def index(request):
    return render(request,'chat/index.html')

def specific_group_chat(request,group_name):
    group,created = Group.objects.get_or_create(name=group_name)
    group.save()
    chats = ChatMessage.objects.filter(group=group)

    return render(request,'chat/group_chat.html',{'group_name':group_name,'chats':chats})

def get_all_users(request):
    all_users = CustomUser.objects.all().values('id','username','email','profilepic')    
    return JsonResponse({'result':list(all_users)},safe=False)

@csrf_exempt
def get_all_messages(request):
    group_details_json_data = request.body.decode('utf8').replace("'",'"')
    group_details_native_data = json.loads(group_details_json_data)
    unique_group_id = group_details_native_data['unique_group_name']
    group_object = Group.objects.filter(unique_id=unique_group_id).first()

    if group_object is None :
        user1 = CustomUser.objects.get(id=group_details_native_data['user1']['id']) 
        user2 = CustomUser.objects.get(id=group_details_native_data['user2']['id']) 
        group_object = Group(name=unique_group_id,unique_id=unique_group_id,user1=user1,user2=user2)
        group_object.save()

    chat_messages = ChatMessage.objects.filter(group=group_object)
    chat_messages_list = ChatMessageSerializer(chat_messages,many=True)    
    chat_messages_json_data = json.dumps(chat_messages_list.data)
    return JsonResponse(chat_messages_json_data,safe=False)

@csrf_exempt
def get_user(request):
    userid_json = request.body.decode('utf8').replace("'",'"')
    userid_native = json.loads(userid_json)
    userid = userid_native['userid']
    requested_user = CustomUser.objects.get(id=userid)
    requested_user = UserSerializer(requested_user)
    return JsonResponse(requested_user.data,safe=False)

@csrf_exempt
def login(request):
    if request.method == "POST":
        username = request.POST["userName"]
        password = request.POST["password"]
        try:
            print(username)
            print(password)
            # currentuser = authenticate(username=username, password=password)
            # print(currentuser)
            cur_user = CustomUser.objects.get(username=username,password=password)
            cur_user = UserSerializer(cur_user)
            cur_user_json = json.dumps(cur_user.data)
            currentuser = cur_user
            if currentuser is not None:
                return JsonResponse(cur_user_json, safe=False)
            else:
                return JsonResponse("Login Failed", safe=False)
        except Exception as e:
            print(f"Error - {e}")
            return JsonResponse("Login Failed", safe=False)

@csrf_exempt
def save_message(request):
    if request.method=='POST':
        user1_id = request.POST.get('message_by')
        user2_id = request.POST.get('received_by')

        user1 = CustomUser.objects.get(id=user1_id)
        user2 = CustomUser.objects.get(id=user2_id)

        unique_group_id = get_unique_group_name(user1,user2)
        group = Group.objects.filter(unique_id=unique_group_id).first()
        
        if group is None:
            group = Group(name=unique_group_id,unique_id=unique_group_id,user1=user1,user2=user2)
            group.save()

        message_type = request.POST.get('type')

        chat_message = None
        if message_type=='file':
            file_input = request.FILES.get('file')
            file_name = file_input.name
            file_extension = get_file_extension(file_name)
            file_name = get_file_name_without_extension(file_name)
            file_name = unique_group_id+"_"+file_name+"_"+generate_random_string()+"."+file_extension
            default_storage.save(file_name,file_input)
            file_link = BASE_SERVER_MEDIA_URL + file_name
            chat_message = ChatMessage(message_content=file_link,timestamp=str(datetime.datetime.now()),message_by=user1,group=group,message_type="file",file_type=file_extension,received_by=user2)
        elif message_type=='text_message':
            text_message = request.POST.get('text')        
            chat_message = ChatMessage(message_content=text_message,timestamp=str(datetime.datetime.now()),message_by=user1,group=group,message_type="text",received_by=user2)
        chat_message.save()

        return JsonResponse("Received",safe=False)
    # message_json = request.body.decode('utf8').replace("'",'"')
    # message_native = json.loads(message_json)
    # user1_id = message_native['message_by']
    # user2_id = message_native['received_by']

    # user1 = CustomUser.objects.get(id=user1_id)
    # user2 = CustomUser.objects.get(id=user2_id)

    # unique_group_id = get_unique_group_name(user1,user2)

    # group = Group.objects.filter(unique_id=unique_group_id).first()

    # if group is None:
    #     group = Group(name=unique_group_id,unique_id=unique_group_id,user1=user1,user2=user2)
    #     group.save()
    
    # chat_message = ChatMessage(message_content=message_native['text'],timestamp=str(datetime.datetime.now()),message_by=user1,group=group)
    # chat_message.save()

    # return JsonResponse("Received",safe=False)

def get_unique_group_name(user1,user2):
    unique_group_name=None
    if user1.username<user2.username:
        unique_group_name = user1.username+"_"+user2.username+"_"+str(user1.id)+"_"+str(user2.id)
    else :
        unique_group_name = user2.username+"_"+user1.username+"_"+str(user2.id)+"_"+str(user1.id)
    return unique_group_name        

@csrf_exempt
def get_online_users(request):
    online_users = CustomUser.objects.filter(online_status=True)
    online_users = UserSerializer(online_users,many=True)
    online_users = online_users.data 
    json_data = json.dumps(online_users)
    return JsonResponse(json_data,safe=False)