from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

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