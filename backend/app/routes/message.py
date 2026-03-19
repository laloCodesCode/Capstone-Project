from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.dependency import get_verified_user
from backend.app.crud.message import (
    create_message,
    create_thread,
    get_listing_by_id,
    get_thread_by_id,
    get_thread_by_listing_and_users,
    get_thread_messages,
    get_user_threads,
)
from backend.app.crud.notification import create_notification
from backend.app.db.dependencies import get_current_user, get_db
from backend.app.models.user import User
from backend.app.schemas import (
    MessageCreate,
    MessageResponse,
    ThreadCreate,
    ThreadResponse,
)

message_router = APIRouter(prefix="/messages", tags=["messages"])


@message_router.post("/threads", response_model=ThreadResponse)
def start_thread(
    payload: ThreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    listing = get_listing_by_id(db, payload.listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot message yourself")

    existing_thread = get_thread_by_listing_and_users(
        db=db,
        listing_id=payload.listing_id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
    )
    if existing_thread:
        return existing_thread

    return create_thread(
        db=db,
        listing_id=payload.listing_id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
    )


@message_router.get("/threads", response_model=list[ThreadResponse])
def get_my_threads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_user_threads(db, current_user.id)


@message_router.get("/threads/{thread_id}/messages", response_model=list[MessageResponse])
def get_messages(
    thread_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    thread = get_thread_by_id(db, thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if current_user.id not in [thread.buyer_id, thread.seller_id]:
        raise HTTPException(status_code=403, detail="Not allowed")

    return get_thread_messages(db, thread_id)


@message_router.post("/threads/{thread_id}/messages", response_model=MessageResponse)
def send_message(
    thread_id: UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    thread = get_thread_by_id(db, thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if current_user.id not in [thread.buyer_id, thread.seller_id]:
        raise HTTPException(status_code=403, detail="Not allowed")

    recipient_id = (
        thread.seller_id if current_user.id == thread.buyer_id else thread.buyer_id
    )

    create_notification(
        db=db,
        user_id=recipient_id,
        type="message",
        content="You have a new message",
    )

    return create_message(db, thread_id, current_user.id, payload.body)