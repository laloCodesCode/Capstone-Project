
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, Str





# Hidding some feilds of information from the user


# Feilds that need to be provided by the user when creating an account
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


# Protected feilds for privacy
class UserResponse(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    role: str

   # Helper inner config class
    class Config:
        orm_mode = True





"""
Schemas to be implemented from splitting UserResponse:
    > UserPublic: Front-Facing Views
    > UserSelf: Authenticated Views (user logged in)
    > UserAdmin: Admin Panel
"""
class UserPublic(BaseModel):
    pass

class UserSelf(BaseModel):
    pass

class UserAdmin(BaseModel):
    pass
