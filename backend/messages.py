from fastapi import APIRouter, Depends, HTTPException
from models import SendMessage
from database import chats_collection, messages_collection
from auth import get_current_user
from bson import ObjectId
from datetime import datetime
from websocket import manager


message_router = APIRouter()


# ==========================================
# SEND MESSAGE
# ==========================================

@message_router.post("/messages/{chat_id}")
async def send_message(

    chat_id: str,

    message: SendMessage,

    current_user_id: str = Depends(get_current_user)

):


    # Check whether chat exists

    chat = chats_collection.find_one({

        "_id": ObjectId(chat_id)

    })


    if not chat:

        raise HTTPException(

            status_code=404,

            detail="Chat not found"

        )


    # Check whether logged-in user belongs to chat

    if current_user_id not in chat["participants"]:

        raise HTTPException(

            status_code=403,

            detail="You are not a participant of this chat"

        )


    # Find other participant

    receiver_id = next(

        user_id

        for user_id in chat["participants"]

        if user_id != current_user_id

    )


    # ==========================================
    # SAVE MESSAGE
    # ==========================================

    created_at = datetime.utcnow()


    result = messages_collection.insert_one({

        "chat_id": chat_id,

        "sender_id": current_user_id,

        "receiver_id": receiver_id,

        "message": message.message,

        "created_at": created_at

    })


    # ==========================================
    # CREATE MESSAGE DATA
    # ==========================================

    message_data = {

        "message_id":
            str(result.inserted_id),

        "chat_id":
            chat_id,

        "sender_id":
            current_user_id,

        "receiver_id":
            receiver_id,

        "message":
            message.message,

        "created_at":
            created_at.isoformat()

    }


    # ==========================================
    # SEND MESSAGE THROUGH WEBSOCKET
    # ==========================================

    await manager.broadcast(

        chat_id,

        message_data

    )


    return {

        "message":
            "Message sent",

        "message_id":
            str(result.inserted_id),

        "chat_id":
            chat_id,

        "sender_id":
            current_user_id,

        "receiver_id":
            receiver_id,

        "text":
            message.message

    }


# ==========================================
# GET MESSAGES
# ==========================================

@message_router.get("/messages/{chat_id}")
def get_messages(

    chat_id: str,

    current_user_id: str = Depends(get_current_user)

):


    # Check whether chat exists

    chat = chats_collection.find_one({

        "_id": ObjectId(chat_id)

    })


    if not chat:

        raise HTTPException(

            status_code=404,

            detail="Chat not found"

        )


    # Check whether logged-in user belongs to chat

    if current_user_id not in chat["participants"]:

        raise HTTPException(

            status_code=403,

            detail="You are not a participant of this chat"

        )


    # Get messages

    messages = messages_collection.find({

        "chat_id": chat_id

    }).sort(

        "created_at",

        1

    )


    message_list = []


    for msg in messages:

        message_list.append({

            "message_id":
                str(msg["_id"]),

            "sender_id":
                msg["sender_id"],

            "receiver_id":
                msg["receiver_id"],

            "message":
                msg["message"],

            "created_at":
                msg["created_at"]

        })


    return message_list