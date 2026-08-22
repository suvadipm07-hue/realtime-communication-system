from pydantic import BaseModel


class RegisterUser(BaseModel):
    user_id: str
    password: str


class LoginUser(BaseModel):
    user_id: str
    password: str