import datetime
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base
from backend.app.models import User, MessageThread, Listing


class Notification(Base):
    __tablename__ = "notification"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )

    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )

    thread_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("message_thread.id", ondelete="CASCADE"),
        nullable=True,
    )

    listing_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("listing.id", ondelete="CASCADE"),
        nullable=True,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        nullable=False,
    )

    is_read: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False,
    )

    actor: Mapped[User | None] = relationship(
        "User",
        foreign_keys=[actor_user_id],
    )

    thread: Mapped[MessageThread | None] = relationship(
        "MessageThread",
        foreign_keys=[thread_id],
    )

    listing: Mapped[Listing | None] = relationship(
        "Listing",
        foreign_keys=[listing_id],
    )