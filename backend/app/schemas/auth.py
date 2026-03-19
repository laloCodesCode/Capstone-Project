from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    username: str
    school_email: EmailStr
    phone_number: str
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    school_email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MessageResponse(BaseModel):
    message: str

class VerifyEmailRequest(BaseModel):
    token: str

class VerifyPhoneRequest(BaseModel):
    code: str = Field(min_length=4, max_length=10)