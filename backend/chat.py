from fastapi import APIRouter, Depends, HTTPException
from models import CreateChat
from database import chats_collection, users_collection
from auth import get_current_user
from bson import ObjectId


chat_router = APIRouter()
search_router = APIRouter()
message_router = APIRouter()



# ==================================
# CREATE CHAT RELATION
# ==================================

@chat_router.get("/chat/list")
def get_chat_list(
    current_user_id: str = Depends(get_current_user)
):

    chats = chats_collection.find({
        "participants": current_user_id
    })

    chat_list = []

    for chat in chats:

        participants = chat["participants"]

        # Find the other user
        other_user_id = next(
            user_id
            for user_id in participants
            if user_id != current_user_id
        )

        # Find other user's information
        other_user = users_collection.find_one(
            {
                "user_id": other_user_id
            },
            {
                "_id": 0,
                "user_id": 1,
                "name": 1
            }
        )

        if other_user:

            chat_list.append({
                "chat_id": str(chat["_id"]),
                "user_id": other_user["user_id"],
                "name": other_user.get("name", "")
            })

    return chat_list

# ==================================
# SEARCH REGISTERED USER
# ==================================

@search_router.get("/users/search/{user_id}")
def search_user(user_id: str):

    # Search registered user
    existing_user = users_collection.find_one(
        {
            "user_id": user_id
        }
    )


    # User does not exist
    if not existing_user:

        print("User not found:", user_id)

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # User exists
    print("User ID found:", user_id)


    # Return safe user data
    return {
        "user_id": existing_user["user_id"],
        "name": existing_user.get("name", "")
    }
# ==================================
# CREATE CHAT
# ==================================

@chat_router.post("/chat/create")
def create_chat(
    chat_data: CreateChat,
    current_user_id: str = Depends(get_current_user)
):
    other_user_id = chat_data.other_user_id

    # Prevent creating a chat with yourself
    if current_user_id == other_user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot create a chat with yourself"
        )

    # Check whether the other user exists
    other_user = users_collection.find_one({
        "user_id": other_user_id
    })

    if not other_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check whether chat already exists
    existing_chat = chats_collection.find_one({
        "participants": {
            "$all": [current_user_id, other_user_id]
        }
    })

    if existing_chat:
        return {
            "message": "Chat already exists",
            "chat_id": str(existing_chat["_id"])
        }

    # Create a new chat
    new_chat = {
        "participants": [
            current_user_id,
            other_user_id
        ]
    }

    result = chats_collection.insert_one(new_chat)

    return {
        "message": "Chat created successfully",
        "chat_id": str(result.inserted_id)
    }