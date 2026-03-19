import datetime
import uuid

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Favorite(Base):
    __tablename__ = "favorite"

    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_favorite_user_listing"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listing.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False,
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="favorites",
    )

    listing: Mapped["Listing"] = relationship(
        "Listing",
        back_populates="favorites",
    )