import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import Base

class Reports(Base):
   __tablename__ = "reports"

   """
   report_id
   decription
   created_at
   listing_id
   user_id
   """
    # Takes the user_id from user model

    user_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),ForeignKey("user.user_id"), nullable=False)
    # Report ID 
    report_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, defualt=uuid.uuid4)
    # Description ie contents of the report 
    description:Mapped[str] = mapped_column(String(1000), nullable=False)
    # Time stamp of when the person/listing was reported
    created_at:Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    # Takes the listing_id from the listing model
    listing_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),ForeignKey("item_listing.listing_id"), nullable=False)


#TODO add relations!

from backend.app.db.base import Base


class Reports(Base):
    __tablename__ = "reports"

    report_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("item_listing.listing_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(String(1000), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
