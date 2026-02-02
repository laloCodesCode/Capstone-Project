




from uuid import UUID
from datetime import datetime 
from pydantic import BaseModel





class ReportCreate(BaseModel):
    user_id: UUID
    listing_id: UUID
    description: str


class ReportResponse(BaseModel):
    report_id: UUID
    user_id: UUID
    listing_id: UUID
    description: str
    created_at: datetime



    class config:
        orm_mode = True




