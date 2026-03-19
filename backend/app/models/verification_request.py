import datetime
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.base import Base


class VerificationRequest(Base):
    __tablename__ = "verification_request"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )

    verification_type: Mapped[str] = mapped_column(
        String(50),
        default="student",
        nullable=False,
    )

    school_id_image_url: Mapped[str] = mapped_column(
        nullable=False,
    )

    selfie_image_url: Mapped[str] = mapped_column(
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
    )

    submitted_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        nullable=False,
    )

    reviewed_at: Mapped[datetime.datetime | None]

    rejection_reason: Mapped[str | None]