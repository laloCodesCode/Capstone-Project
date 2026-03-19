import datetime
import uuid
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class MessageThread(Base):
    __tablename__ = "message_thread"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    seller_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False

    )
    buyer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listing.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False
    )
    __table_args__ = (
        UniqueConstraint("buyer_id", "seller_id", "listing_id", name="uq_thread_buyer_seller_listing"),
    )
    listing: Mapped["Listing"] = relationship(
        "Listing",
        back_populates="threads",
    )

    # Buyer relationship
    buyer: Mapped["User"] = relationship(
        "User",
        back_populates="buyer_threads",
        foreign_keys=[buyer_id],
    )

    # Seller relationship
    seller: Mapped["User"] = relationship(
        "User",
        back_populates="seller_threads",
        foreign_keys=[seller_id],
    )

    # Messages inside thread
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="thread",
        cascade="all, delete-orphan",
    )

