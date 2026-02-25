from __future__ import annotations

from uuid import UUID
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from backend.app.models import user_documents


# Base user_document schema

class User_DocumentsBase(BaseModel):
    document_type: str = Field(..., max_length=50)



# Create user document
class User_DocumentsCreate(User_DocumentsBase):
    # file_url: str
    pass



# Update user document
class User_DocumentsUpdate(BaseModel):
    document_type: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, max_length=20)



# Read/Response user document
class User_DocumentOut(User_DocumentsBase):
    """API returns"""
    model_config = ConfigDict(from_attributes=True)
    user_documents_id: UUID
    user_id: UUID
    file_url: str
    status: str
