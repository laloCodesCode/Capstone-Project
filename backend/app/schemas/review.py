from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    reviewed_user_id: UUID
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    reviewer_id: UUID
    reviewed_user_id: UUID
    rating: int
    comment: str | None
    created_at: datetime

class ReviewSummaryResponse(BaseModel):
    user_id: UUID
    average_rating: float
    review_count: int