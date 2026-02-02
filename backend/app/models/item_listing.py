import uuid
from sqlalchemy import String, Text, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from backend.app.db.base import Base

class ItemListing(Base):
    __tablename__ = "item_listing"


    # Create listing_id
    listing_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


    # Map listing with user_id
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Create title
    title: Mapped[str] = mapped_column(String(100), nullable=False)


    # Create description
    description: Mapped[str] = mapped_column(Text, nullable=False)


    # Create price
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)


    # Create createdAt
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    # Create isActive
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


    #TODO: relationships                
