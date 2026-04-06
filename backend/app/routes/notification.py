from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.crud.notification import (
    get_notification,
    get_user_notifications,
     get_unread_notification_count,
    mark_all_notifications_as_read
)
from backend.app.db.dependencies import get_db
from backend.app.core.dependency import get_verified_user
from backend.app.models.user import User
from backend.app.schemas import NotificationResponse
from backend.app.schemas.notification import NotificationUnreadCountResponse

notification_router = APIRouter(prefix="/notification", tags=["notification"])


@notification_router.get("/", response_model=list[NotificationResponse])
def read_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_user_notifications(db=db, user_id=current_user.id)


@notification_router.patch("/{notification_id}/read", response_model=NotificationResponse)
def read_single_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    notification = get_notification(db=db, notification_id=notification_id)

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return mark_all_notifications_as_read(db=db, user_id=current_user.id)


@notification_router.get("/unread-count", response_model=NotificationUnreadCountResponse)
def unread_notification_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    count = get_unread_notification_count(db=db, user_id=current_user.id)
    return {"unread_count": count}

@notification_router.patch("/read-all")
def read_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    mark_all_notifications_as_read(db=db, user_id=current_user.id)
    return {"message": "All notifications marked as read"}