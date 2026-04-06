from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.config.settings import settings
from backend.app.models.notification import Notification


def create_notification(
    db: Session,
    *,
    user_id: UUID,
    type: str,
    content: str,
    actor_user_id: UUID | None = None,
    thread_id: UUID | None = None,
    listing_id: UUID | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        actor_user_id=actor_user_id,
        thread_id=thread_id,
        listing_id=listing_id,
        type=type,
        content=content,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_user_notifications(db: Session, *, user_id: UUID) -> list[dict]:
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )

    results = []

    for notification in notifications:
        listing = notification.listing

        image_to_use = None
        if listing and listing.images:
            image_to_use = next(
                (image for image in listing.images if image.is_primary),
                None,
            )
            if image_to_use is None:
                image_to_use = listing.images[0]

        results.append(
            {
                "id": notification.id,
                "user_id": notification.user_id,
                "actor_user_id": notification.actor_user_id,
                "thread_id": notification.thread_id,
                "listing_id": notification.listing_id,
                "type": notification.type,
                "content": notification.content,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
                "actor_username": (
                    notification.actor.username if notification.actor else None
                ),
                "listing_title": listing.title if listing else None,
                "listing_image_url": (
                    f"{settings.BACKEND_BASE_URL}/listing-image/{image_to_use.id}/download"
                    if image_to_use
                    else None
                ),
            }
        )

    return results


def get_notification(db: Session, *, notification_id: UUID) -> Notification | None:
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )


def mark_all_notifications_as_read(db: Session, *, user_id: UUID) -> None:
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

def get_unread_notification_count(db: Session, *, user_id: UUID) -> int:
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .count()
    )