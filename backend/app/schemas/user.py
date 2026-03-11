
from uuid import UUID
from pydantic import BaseModel, EmailStr, StrictFloat


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str


class UserResponse(BaseModel):

    user_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    username: str
    role: str

# Password Change logic
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

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
