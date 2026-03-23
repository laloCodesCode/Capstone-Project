import datetime
import uuid

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.message_thread import MessageThread
from backend.app.models.favorite import Favorite
from backend.app.models.category import Category
from backend.app.models.user import User

from backend.app.db.base import Base


class Listing(Base):
    __tablename__ = "listing"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    seller_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now
    )

    condition: Mapped[str] = mapped_column(
        nullable=False,
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("category.id", ondelete="SET NULL"),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(default="active", nullable=False)

    location: Mapped[str] = mapped_column(nullable=False)


    category: Mapped["Category"] = relationship(
        "Category",
        back_populates="listings"
    )
    seller: Mapped["User"] = relationship(
        "User",
        back_populates="listings",
    )
    # listing.py
    favorites: Mapped[list["Favorite"]] = relationship(
        "Favorite",
        back_populates="listing",
        cascade="all, delete-orphan",
    )
    threads: Mapped[list["MessageThread"]] = relationship(
        "MessageThread",
        back_populates="listing",
        cascade="all, delete-orphan",
    )
    images: Mapped[list["ListingImage"]] = relationship(
        "ListingImage",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

