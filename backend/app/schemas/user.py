from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from backend.app.schemas.listing import ListingResponse


class UserResponse(BaseModel):
    id: UUID
    school_email: EmailStr
    username: str
    phone_number: str | None = None
    is_email_verified: bool
    is_phone_verified: bool
    profile_image_url: str | None = None
    created_at: datetime


class PublicUserProfileResponse(BaseModel):
    id: UUID
    username: str
    school_email: str
    profile_image_url: str | None = None
    listings: list[ListingResponse]


class ProfileImageUploadResponse(BaseModel):
    profile_image_url: str
#add later
    #@field_validator("school_email")
    #@classmethod
    #def validate_uncg_email(cls, value: str):
    #    if not value.lower().endswith("@uncg.edu"):
    #       raise ValueError("Must register with a UNCG email address")
    #    return value