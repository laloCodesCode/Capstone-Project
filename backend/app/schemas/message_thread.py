from pydantic import BaseModel
from uuid import UUID

class MessageThreadCreate(BaseModel):
    listing_id: UUID
