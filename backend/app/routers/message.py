from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db, get_current_user
from backend.app.crud.message import create_message, list_messages_for_thread
from backend.app.models.user import User
from backend.app.schemas.message import MessageOut, MessageCreate

router = APIRouter(prefix="/threads", tags=["messages"])

@router.post("/{thread_id}/messages", response_model=MessageOut)
def post_message(
    thread_id: UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_message(
        db=db,
        current_user=current_user,
        thread_id=thread_id,
        body=payload.body,
    )

@router.get("/{thread_id}/messages", response_model=list[MessageOut])
def get_messages(
    thread_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_messages_for_thread(
        db=db,
        user_id=current_user.user_id,
        thread_id=thread_id,
    )
