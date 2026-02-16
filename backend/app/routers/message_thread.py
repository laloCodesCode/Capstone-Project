from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db, get_current_user
from backend.app.crud.thread import list_user_threads, create_thread, get_thread_for_user




#from backend.app.models.user import User
from app.models import User



from backend.app.schemas.message import MessageOut
from backend.app.schemas.message_thread import MessageThreadCreate, MessageThreadOut

router = APIRouter(prefix="/message_thread", tags=["Message Thread"])

@router.get("/", response_model=list[MessageOut])
def get_my_threads(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    return list_user_threads(db, user_id = current_user.user_id)

@router.post("/", response_model=MessageOut, status_code=201)
def create_thread_for_listing(
        payload: MessageThreadCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    return create_thread(db=db, current_user=current_user, listing_id=payload.listing_id)

@router.get("/{thread_id}", response_model=MessageThreadOut)
def get_thread(
    thread_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    thread = get_thread_for_user(
        db=db,
        user_id=current_user.user_id,
        thread_id=thread_id,
    )

    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    return thread
