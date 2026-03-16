from __future__ import annotations

from uuid import UUID
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict
from backend.app.models import item_image

# Base item image schema    
class Item_ImageBase(BaseModel):
    is_primary: bool = Field(...)


# Create item image
class Item_ImageCreate(Item_ImageBase):
    pass

# Read/Response item image
class Item_ImageOut(Item_ImageBase):
    model_config = ConfigDict(from_attributes=True)
    image_id: UUID
    item_listing_id: UUID
    file_url: str
    is_primary: bool
    created_at: datetime
    
