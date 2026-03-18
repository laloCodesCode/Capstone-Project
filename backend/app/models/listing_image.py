import datetime
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import mapped_column, Mapped

from backend.app.db.base import Base


class ListingImage(Base):
    __tablename__ = "listing_image"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listing.id", ondelete="CASCADE"),
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(nullable=False)

    is_primary: Mapped[bool] = mapped_column(default=False, nullable=False)

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.utcnow,
        nullable=False,
    )