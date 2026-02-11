from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.message_thread import MessageThread
from backend.app.models.message import Message


def create_message(db: Session, current_user, thread_id: UUID, body: str) -> Message:
    thread = db.get(MessageThread, thread_id)
    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    if current_user.user_id not in (thread.buyer_id, thread.seller_id):
        raise HTTPException(status_code=403, detail="Not allowed in this thread")

    message = Message(
        thread_id=thread_id,
        sender_id=current_user.user_id,
        body=body,
    )

    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def list_messages_for_thread(db: Session, user_id: UUID, thread_id: UUID) -> list[Message]:
    thread = db.get(MessageThread, thread_id)
    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    if user_id not in (thread.buyer_id, thread.seller_id):
        raise HTTPException(status_code=403, detail="Not allowed in this thread")

    stmt = (
        select(Message)
        .where(Message.thread_id == thread_id)
        .order_by(Message.created_at.desc())
    )
    return list(db.scalars(stmt).all())