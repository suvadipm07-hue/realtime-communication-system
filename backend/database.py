import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["xchat"]

users_collection = db["users"]
chats_collection = db["chats"]
messages_collection = db["messages"]

users_collection.create_index(
    "user_id",
    unique=True
)