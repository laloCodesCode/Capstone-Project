import uuid
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

#from backend.app.db.base import Base
from app.db.base import Base

class User(Base):
    #__tablename__ = "users"
    __tablename__ = "user"

    # Primary key UUID
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    first_name: Mapped[str] = mapped_column(String(20), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    username: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)

    # Create password
    password: Mapped[str] = mapped_column(String(500), nullable=False)


    # role default is USER
    role: Mapped[str] = mapped_column(String(30), nullable=False, default="USER")

    # TODO: Add realtions!


    # listings
    listings = relationship("ItemListing", back_populates="owner", cascade="all, delete-orphan")
    documents = relationship(
        "UserDocuments",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    # documents
    threads_as_seller = relationship(
        "MessageThread",
        foreign_keys="MessageThread.seller_id",
        back_populates="seller",
        cascade="all, delete-orphan",
    )

    # Messaging
    threads_as_buyer = relationship(
        "MessageThread",
        foreign_keys="MessageThread.buyer_id",
        back_populates="buyer",
        cascade="all, delete-orphan",
    )

    # optional of Messaging but usually useful:
    messages_sent = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan",
    )

    # reports
    reports = relationship(
        "Reports",
        back_populates="user",
        cascade= "all, delete-orphan"
    )
