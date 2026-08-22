from pwdlib import PasswordHash
import jwt
from datetime import datetime, timedelta

password_hash = PasswordHash.recommended()

SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"


def hash_password(password: str):
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str):
    return password_hash.verify(password, hashed_password)


def create_token(user_id: str):
    expire = datetime.utcnow() + timedelta(hours=24)

    payload = {
        "user_id": user_id,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)