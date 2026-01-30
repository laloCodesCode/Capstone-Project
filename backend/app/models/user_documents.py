import uuid
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import func

from app.db.base import Base

class User_Documents(Base): 
    __tablename__ = "User_Documents"


    # Create user_documents_id
    user_documents_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


    # Map user_documents with user_id 
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user_id", ondelete="CASCADE", nullable=False, index=True))


    # Create document_type
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)


    # Create file_url
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)


    # Create status
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING")


    # Create uplaodedAt
    uploadedAt: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)





