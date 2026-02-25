from __future__ import annotations

from uuid import UUID 
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


# Base schema
class Item_ListingBase(BaseModel):
    """Base schema for item listing"""
    title: str = Field(..., max_length=100)
    description: str = Field(None, max_length=200)
    price: Decimal = Field(..., ge=0)


# Item image
class ItemImageResponse(BaseModel):
    image_id: UUID
    url: str
    is_primary: bool


# Create item listing 
class Item_ListingCreate(Item_ListingBase):
    """Schema for creating an item listing"""
    pass


# Update item listing
class Item_ListingUpdate(BaseModel):
    """Schema for updating an item listing"""
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=200)
    price: Optional[Decimal] = Field(None, ge=0)
    is_active: Optional[bool] = None



# Read/Response item listing

class Item_ListingOut(Item_ListingBase):
    """ API returns"""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    is_active: bool
    created_at: datetime


    images: List[ItemImageResponse] = []



