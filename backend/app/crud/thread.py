from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from backend.app.models.message_thread import MessageThread
from backend.app.models.item_listing import ItemListing


def create_thread(db: Session, current_user, listing_id: UUID) -> MessageThread:
    listing = db.get(ItemListing, listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")

    buyer_id = current_user.user_id
    seller_id = listing.user_id

    if buyer_id == seller_id:
        raise HTTPException(status_code=400, detail="Seller is buyer")

    stmt = (
        select(MessageThread)
        .where(
            MessageThread.listing_id == listing_id,
            MessageThread.buyer_id == buyer_id,
            MessageThread.seller_id == seller_id,
        )
    )
    existing_thread = db.execute(stmt).scalar_one_or_none()
    if existing_thread:
        return existing_thread

    new_thread = MessageThread(
        listing_id=listing_id,
        buyer_id=buyer_id,
        seller_id=seller_id,
    )

    db.add(new_thread)
    db.commit()
    db.refresh(new_thread)
    return new_thread


def list_user_threads(db: Session, user_id: UUID) -> list[MessageThread]:
    stmt = (
        select(MessageThread)
        .where(or_(MessageThread.buyer_id == user_id, MessageThread.seller_id == user_id))
        .order_by(MessageThread.updated_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_thread_for_user(db: Session, user_id: UUID, thread_id: UUID) -> MessageThread | None:
    thread = db.get(MessageThread, thread_id)
    if thread is None:
        return None
    if user_id not in (thread.buyer_id, thread.seller_id):
        return None
    return thread