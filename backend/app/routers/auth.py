from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db, get_current_user
from backend.app.core.security import verify_password, create_access_token, hash_password
from backend.app.crud.user import get_user_by_email_or_username, create_user
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserResponse, PasswordChange

auth_router = APIRouter(tags=["auth"])

@auth_router.post("/token")
def login (
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        or_(
            User.email == form_data.username,
            User.username == form_data.username,
        )
    ).first()

    if not user or not verify_password(form_data.password, str(user.password)):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(subject=str(user.user_id))
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "username": current_user.username,
        "email": current_user.email,

    }
@auth_router.post("/register", response_model=UserResponse)
def register(
        payload: UserCreate,
        db: Session = Depends(get_db),
):
    if get_user_by_email_or_username(db, payload.email):
        raise HTTPException(status_code=401, detail="Email already registered")

    if get_user_by_email_or_username(db, payload.username):
        raise HTTPException(status_code=401, detail="Username already taken")

    return create_user(db, payload)

#Allowing the user to change their password
@auth_router.put("/me/password")
def change_password(payload: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.current_password, str(current_user.password)):
        raise HTTPException(status_code=400, detail="Current password id incorrect!")

    current_user.password = hash_password(payload.new_password)
    db.commit()
    return{"details": "Password changed successfully!"}



