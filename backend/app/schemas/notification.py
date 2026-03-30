from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    actor_user_id: UUID | None = None
    thread_id: UUID | None = None
    listing_id: UUID | None = None

    type: str
    content: str
    is_read: bool
    created_at: datetime

    actor_username: str | None = None
    listing_title: str | None = None
    listing_image_url: str | None = None

class NotificationUnreadCountResponse(BaseModel):
    unread_count: int