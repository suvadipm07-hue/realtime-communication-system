from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from database import (
chats_collection,
messages_collection
)

from auth import get_current_user

#ROUTER

chat_actions_router = APIRouter()


#CLEAR ALL MESSAGES


@chat_actions_router.delete(
"/messages/{chat_id}/clear"
)
def clear_messages(

chat_id: str,

current_user_id: str = Depends(
    get_current_user
)

):

    # CHECK CHAT EXISTS
    chat = chats_collection.find_one({

    "_id": ObjectId(chat_id)

    })


    if not chat:

        raise HTTPException(

            status_code=404,

            detail="Chat not found"

        )


    # CHECK USER BELONGS TO CHAT

    if current_user_id not in chat["participants"]:

        raise HTTPException(

            status_code=403,

            detail="You are not a participant of this chat"

        )


    # DELETE ALL MESSAGES


    result = messages_collection.delete_many({

        "chat_id": chat_id

    })


    return {

        "message":
            "All messages cleared",

        "deleted_count":
            result.deleted_count

    }

#DELETE COMPLETE CHAT


@chat_actions_router.delete(
"/chat/{chat_id}"
)
def delete_chat(

    chat_id: str,

    current_user_id: str = Depends(
    get_current_user
    )

    ):


    # CHECK CHAT EXISTS


    chat = chats_collection.find_one({

    "_id": ObjectId(chat_id)

    }
    )


    if not chat:

        raise HTTPException(

            status_code=404,

            detail="Chat not found"

        )


    # CHECK USER BELONGS TO CHAT

    if current_user_id not in chat["participants"]:

        raise HTTPException(

            status_code=403,

            detail="You are not a participant of this chat"

        )

    # DELETE ALL CHAT MESSAGES


    messages_collection.delete_many({

        "chat_id": chat_id

    })



    # DELETE CHAT


    chats_collection.delete_one({

        "_id": ObjectId(chat_id)

    })

    return {

        "message":"Chat deleted successfully"
    }