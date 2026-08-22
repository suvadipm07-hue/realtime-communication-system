from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError

from database import users_collection
from models import RegisterUser, LoginUser
from auth import hash_password, verify_password, create_token



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "FastAPI server is running"}


# ---------------- REGISTER ----------------

@app.post("/register")
def register(user: RegisterUser):

    print("REGISTER API CALLED")
    print("User ID:", user.user_id)

    existing_user = users_collection.find_one({
        "user_id": user.user_id
    })

    if existing_user:
        print("DUPLICATE USER ID")

        raise HTTPException(
            status_code=400,
            detail="User ID already exists"
        )

    hashed_password = hash_password(user.password)

    print("Password hashed")

    new_user = {
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

    # Create JWT token
    token = create_token(existing_user["user_id"])

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }