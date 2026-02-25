from datetime import datetime

from sqlalchemy import ForeignKey, String, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid

#from backend.app.db.base import Base
from app.db.base import Base
class ItemImage(Base):
   

   
   __tablename__ = 'item_listing'

   image_id: Mapped[uuid.UUID] = mapped_column(
       UUID(as_uuid=True),
       primary_key=True,
       default=uuid.uuid4,
   )

   item_listing_id: Mapped[uuid.UUID] = mapped_column(
       UUID(as_uuid=True),
       ForeignKey('item_listing.item_listing_id'),
       nullable=False,
       index=True
   )
   url: Mapped [str] = mapped_column(
       String(500),
       nullable=False,
   )
   created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

   is_primary: Mapped[bool] = mapped_column(
       Boolean,
       nullable=False,
       default=False
   )

   listing = relationship("ItemListing", back_populates="images")

   images = relationship("ItemImage", back_populates="listing")




