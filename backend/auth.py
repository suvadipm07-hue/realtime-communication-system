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


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        print("TOKEN EXPIRED")
        return None
    except jwt.InvalidTokenError as e:
        print("TOKEN INVALID:", e)
        return None