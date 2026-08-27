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