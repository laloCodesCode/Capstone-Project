from __future__ import annotations

from uuid import UUID 
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict
from .item_image import Item_ImageOut


# User info for item listing response
class ItemListingUserOut(BaseModel):
    first_name: str
    last_name: str
    email: str
    username: str

    model_config = ConfigDict(from_attributes=True)

# Base schema
class Item_ListingBase(BaseModel):
    title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=200)
    price: Decimal = Field(..., ge=0)


# Create item listing 
class Item_ListingCreate(Item_ListingBase):
    pass


# Update item listing
class Item_ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: str = Field(..., max_length=200)
    price: Optional[Decimal] = Field(None, ge=0)
    is_active: Optional[bool] = None



# Read/Response item listing

class Item_ListingOut(Item_ListingBase):
    model_config = ConfigDict(from_attributes=True)

    item_listing_id: UUID
    user_id: UUID
    title: str
    description: str
    price: Decimal
    is_active: bool
    created_at: datetime
    owner: ItemListingUserOut
    images: list[Item_ImageOut] = []





