from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class UserResponse(BaseModel):

    id: UUID
    school_email: EmailStr
    username: str
    phone_number: str | None = None
    is_email_verified: bool
    is_phone_verified: bool
    created_at: datetime




#add later
    #@field_validator("school_email")
    #@classmethod
    #def validate_uncg_email(cls, value: str):
    #    if not value.lower().endswith("@uncg.edu"):
    #       raise ValueError("Must register with a UNCG email address")
    #    return value