from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ThreadCreate(BaseModel):
    listing_id: UUID

class ThreadResponse(BaseModel):
    id: UUID
    seller_id: UUID
    buyer_id: UUID
    listing_id: UUID
    created_at: datetime

class MessageCreate(BaseModel):
    body: str = Field(min_length=1, max_length=200)

class MessageResponse(BaseModel):
    id: UUID
    thread_id: UUID
    message_user: UUID
    body: str
    created_at: datetime
    
class InboxThreadResponse(BaseModel):
    id: UUID
    other_user_id: UUID
    other_user_name: str
    listing_id: UUID
    last_message: str | None
    last_message_at: datetime | None
    unread_count: int = 0
    listing_image_url: str | None = None