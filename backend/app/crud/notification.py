from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.notification import Notification


def create_notification(
    db: Session,
    *,
    user_id: UUID,
    type: str,
    content: str,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=type,
        content=content,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_user_notifications(db: Session, *, user_id: UUID) -> list[type[Notification]]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_notification(db: Session, *, notification_id: UUID) -> Notification | None:
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )


def mark_notification_as_read(db: Session, *, notification: Notification) -> Notification:
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

def get_unread_notification_count(db: Session, *, user_id: UUID) -> int:
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        )
        .count()
    )