import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.sql import func

from backend.app.db.base import Base


class MessageThread(Base):
    __tablename__ = "message_thread"

    thread_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("item_listing.item_listing_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    seller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    buyer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "listing_id", "buyer_id", "seller_id", name="uq_thread_listing_buyer_seller"
        ),
    )

    listing = relationship("ItemListing", back_populates="threads")
    messages = relationship("Message", back_populates="thread", cascade="all, delete-orphan")

    seller = relationship("User", foreign_keys=[seller_id], back_populates="threads_as_seller")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="threads_as_buyer")