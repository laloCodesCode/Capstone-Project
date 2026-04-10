

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FavoriteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    listing_id: UUID
    user_id: UUID
    created_at: datetime

class FavoriteListingResponse(BaseModel):
    id: UUID
    listing_id: UUID
    user_id: UUID
    created_at: datetime

    title: str
    price: float
    location: str
    status: str
    listing_image_url: str | None = None