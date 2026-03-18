from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.app.core.email import send_verification_email
from backend.app.core.security import verify_password
from backend.app.core.token import create_access_token, decode_access_token, create_email_verification_token
from backend.app.crud.user import get_user_by_school_email_or_username, create_user
from backend.app.db.dependencies import get_db, get_current_user
from backend.app.models import User
from backend.app.schemas import UserResponse, UserRegister

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/register", response_model=UserResponse)
def register(
    payload: UserRegister,
    db: Session = Depends(get_db)
):
    if get_user_by_school_email_or_username(db, payload.school_email):
        raise HTTPException(status_code=401, detail="Email already registered")
    if get_user_by_school_email_or_username(db, payload.username):
        raise HTTPException(status_code=401, detail="Username already registered")
    user = create_user(db, payload)

    token = create_email_verification_token(str(user.id))

    send_verification_email(
        to_email=user.school_email,
        username=user.username,
        token=token,
    )

    return user

@auth_router.post("/token")
def login (
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        or_(
            User.school_email == form_data.username,
            User.username == form_data.username,
        )
    ).first()

    if not user or not verify_password(form_data.password, str(user.password_hash)):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in."
        )

    token = create_access_token({
        "sub": str(user.id),
        "type": "access",
    })
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "school_email": current_user.school_email,

    }


@auth_router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)

    if payload.get("type") != "email_verification":
        raise HTTPException(status_code=400, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid token")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_email_verified:
        return {"message": "Email already verified"}

    user.is_email_verified = True
    user.email_verified_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Email verified successfully"}

@auth_router.post("/resend-verification")
def resend_verification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.is_email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )

    token = create_email_verification_token(str(current_user.id))

    send_verification_email(
        to_email=current_user.school_email,
        username=current_user.username,
        token=token,
    )

    return {"message": "Verification email sent"}