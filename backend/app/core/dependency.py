from fastapi import Depends, HTTPException
from backend.app.db.dependencies import get_current_user
from backend.app.models import User


def get_verified_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.is_banned:
        raise HTTPException(status_code=403, detail="Your account has been suspended")

    if not current_user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email first."
        )

    return current_user

def get_admin_user(current_user: User = Depends(get_verified_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )
    return current_user