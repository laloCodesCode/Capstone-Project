from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ListingImageCreate(BaseModel):
    is_primary: bool = False


class ListingImageOut(BaseModel):

    id: UUID
    listing_id: UUID
    image_url: str
    is_primary: bool
    created_at: datetime