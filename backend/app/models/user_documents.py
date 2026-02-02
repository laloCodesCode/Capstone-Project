import uuid
from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from backend.app.db.base import Base
class UserDocuments(Base):

    __tablename__ = "user_document"


    # Create user_documents_id
    user_documents_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


    # Map user_documents with user_id
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.user_id", ondelete="CASCADE", ),
        nullable=False,
        index=True,
    )

    # Create document_type
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)


    # Create file_url
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)


    # Create status
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING")


    # Create uplaodedAt
    uploadedAt: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User", back_populates="documents")





