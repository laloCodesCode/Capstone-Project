from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReportCreate(BaseModel):
    listing_id: UUID
    reason: str


class ReportResponse(BaseModel):
    id: UUID
    reporter_id: UUID
    listing_id: UUID
    reason: str
    created_at: datetime

    model_config = {"from_attributes": True}
