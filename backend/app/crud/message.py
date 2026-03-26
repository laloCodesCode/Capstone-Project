from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.config.settings import settings
from backend.app.models.listing import Listing
from backend.app.models.message import Message
from backend.app.models.message_thread import MessageThread


def get_thread_by_listing_and_users(
    db: Session,
    listing_id: UUID,
    buyer_id: UUID,
    seller_id: UUID,
) -> MessageThread | None:
    return (
        db.query(MessageThread)
        .filter(
            MessageThread.listing_id == listing_id,
            MessageThread.buyer_id == buyer_id,
            MessageThread.seller_id == seller_id,
        )
        .first()
    )


def create_thread(
    db: Session,
    listing_id: UUID,
    buyer_id: UUID,
    seller_id: UUID,
) -> MessageThread:
    thread = MessageThread(
        listing_id=listing_id,
        buyer_id=buyer_id,
        seller_id=seller_id,
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread


def get_user_threads(db: Session, user_id: UUID) -> list[type[MessageThread]]:
    return (
        db.query(MessageThread)
        .filter(
            (MessageThread.buyer_id == user_id) | (MessageThread.seller_id == user_id)
        )
        .order_by(MessageThread.created_at.desc())
        .all()
    )


def get_thread_by_id(db: Session, thread_id: UUID) -> MessageThread | None:
    return db.query(MessageThread).filter(MessageThread.id == thread_id).first()


def get_thread_messages(db: Session, thread_id: UUID) -> list[type[Message]]:
    return (
        db.query(Message)
        .filter(Message.thread_id == thread_id)
        .order_by(Message.created_at.asc())
        .all()
    )


def create_message(db: Session, thread_id: UUID, user_id: UUID, body: str) -> Message:
    message = Message(
        thread_id=thread_id,
        message_user=user_id,
        body=body,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_listing_by_id(db: Session, listing_id: UUID) -> Listing | None:
    return db.query(Listing).filter(Listing.id == listing_id).first()


def get_user_inbox_threads(db: Session, user_id: UUID):
    threads = (
        db.query(MessageThread)
        .filter(
            (MessageThread.buyer_id == user_id) | (MessageThread.seller_id == user_id)
        )
        .order_by(MessageThread.created_at.desc())
        .all()
    )

    results = []

    for thread in threads:
        other_user = thread.seller if thread.buyer_id == user_id else thread.buyer

        last_message = (
            db.query(Message)
            .filter(Message.thread_id == thread.id)
            .order_by(Message.created_at.desc())
            .first()
        )

        listing = thread.listing

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
                "id": thread.id,
                "other_user_id": other_user.id,
                "other_user_name": other_user.username,
                "listing_id": thread.listing_id,
                "last_message": last_message.body if last_message else None,
                "last_message_at": last_message.created_at if last_message else None,
                "unread_count": 0,
                "listing_image_url": (
                    f"{settings.BACKEND_BASE_URL}/listing-image/{image_to_use.id}/download"
                    if image_to_use
                    else None
                ),
                "listing_title": listing.title if listing else None,
            }
        )

    return results