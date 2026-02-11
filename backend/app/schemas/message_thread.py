from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MessageThreadCreate(BaseModel):
    listing_id: UUID


class MessageThreadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    thread_id: UUID
    listing_id: UUID
    buyer_id: UUID
    seller_id: UUID
    created_at: datetime
    updated_at: datetime