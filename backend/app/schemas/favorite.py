from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FavoriteResponse(BaseModel):
    id: UUID
    listing_id: UUID
    user_id: UUID
    created_at: datetime