# uvicorn main:app --reload

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from chat import chat_router
from chat import search_router
from messages import message_router
from database import users_collection
from models import RegisterUser, LoginUser
from websocket  import websocket_router
from chat_actions import chat_actions_router

from auth import (
    hash_password,
    verify_password,
    create_token,
    decode_token
)


app = FastAPI()
app.include_router(chat_router)
app.include_router(search_router)
app.include_router(message_router)
app.include_router(websocket_router)
app.include_router(chat_actions_router)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
   allow_origins = [
    "https://YOUR-FRONTEND.onrender.com",
    "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "FastAPI server is running"
    }


# ---------------- REGISTER ----------------

@app.post("/register")
def register(user: RegisterUser):

    print("REGISTER API CALLED")
    print("User ID:", user.user_id)

    # Check if user already exists
    existing_user = users_collection.find_one({
        "user_id": user.user_id
    })

    if existing_user:
        print("DUPLICATE USER ID")

        raise HTTPException(
            status_code=400,
            detail="User ID already exists"
        )

    # Hash password
    hashed_password = hash_password(user.password)

    print("Password hashed")

    # Create user document
    new_user = {
        "name": user.name,
        "user_id": user.user_id,
        "password": hashed_password
    }

    try:

        result = users_collection.insert_one(new_user)

        print("USER INSERTED:", result.inserted_id)

    except DuplicateKeyError:

        raise HTTPException(
            status_code=400,
            detail="User ID already exists"
        )

    return {
        "message": "Registration successful"
    }


# ---------------- LOGIN ----------------

@app.post("/login")
def login(user: LoginUser):

    # Find user
    existing_user = users_collection.find_one({
        "user_id": user.user_id
    })

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID or password"
        )

    # Create JWT
    token = create_token(
        existing_user["user_id"]
    )

    print("LOGIN SUCCESS")
    print("User ID:", existing_user["user_id"])

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


# ---------------- ALL USERS / CHAT LIST ----------------

@app.get("/user")
def getUserDetails():

    try:

        users = users_collection.find()

        result = []

        for user in users:

            user["_id"] = str(user["_id"])

            result.append(user)

        return result

    except Exception as e:

        print("Error:", e)

        raise HTTPException(
            status_code=500,
            detail="Error fetching users"
        )


# ---------------- CURRENT LOGGED-IN USER ----------------
@app.get("/user/me")
def get_logged_in_user(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )

    token = authorization.split(" ", 1)[1]

    user_id = decode_token(token)

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = users_collection.find_one({
        "user_id": user_id
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "name": user["name"],
        "user_id": user["user_id"]
    }