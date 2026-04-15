import datetime
import uuid

from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped, MappedColumn, relationship

from backend.app.db.base import Base


class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    username: Mapped[str] = MappedColumn(
        String(25),
        unique=True,
        nullable=False,
    )
    profile_image_url: Mapped[str | None] = mapped_column(nullable=True)
    is_admin: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_banned: Mapped[bool] = mapped_column(default=False, nullable=False)
    school_email: Mapped[str] = mapped_column(unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20),unique=True, nullable=False)
    is_email_verified: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )
    is_phone_verified: Mapped[bool] = mapped_column(default=False, nullable=False)

    email_verified_at: Mapped[datetime.datetime | None]
    phone_verified_at: Mapped[datetime.datetime | None]


    password_hash: Mapped[str] = MappedColumn(
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        onupdate=datetime.datetime.now
    )

    listings: Mapped[list["Listing"]] = relationship(
        "Listing",
        back_populates="seller",
        cascade="all, delete-orphan",
    )
    # user.py
    favorites: Mapped[list["Favorite"]] = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    # Messages sent by user
    sent_messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="sender",
        foreign_keys="Message.message_user",
    )

    # Threads where user is buyer
    buyer_threads: Mapped[list["MessageThread"]] = relationship(
        "MessageThread",
        back_populates="buyer",
        foreign_keys="MessageThread.buyer_id",
    )

    # Threads where user is seller
    seller_threads: Mapped[list["MessageThread"]] = relationship(
        "MessageThread",
        back_populates="seller",
        foreign_keys="MessageThread.seller_id",
    )



