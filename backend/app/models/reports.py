import uuid 
from sqlalchemy import String, DateTime 
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

class Reports(Base):
   __tablename__ = "Reports"

   """
   report_id
   decription
   created_at
   listing_id
   user_id
   """
    # Takes the user_id from user model
    user_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),ForgienKey("user.user_id"), nullable=False)
    
    # Report ID 
    report_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, defualt=uuid.uuid4)

    # Description ie contents of the report 
    description:Mapped[str] = mapped_column(String(1000), nullable=False)

    # Time stamp of when the person/listing was reported
    created_at:Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    # Takes the listing_id from the listing model
    listing_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),ForgienKey("item_listing.listing_id"), nullable=False)


#TODO add relations!
