from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    condition: str
    category_id: UUID | None = None
    location: str

class ListingResponse(BaseModel):

    id: UUID
    title: str
    description: str
    price: float
    condition: str
    location: str
    status: str
    seller_id: UUID
    category_id: UUID | None
    created_at: datetime

class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    condition: str | None = None
    location: str | None = None
    category_id: UUID | None = None
    status: str | None = None