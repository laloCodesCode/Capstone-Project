import uuid

from pydantic import EmailStr
from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.app.core.security import hash_password
from backend.app.models import User
from backend.app.schemas import UserRegister


def create_user(db: Session, user: UserRegister) -> User:
    user = User(
        school_email=user.school_email,
        phone_number=user.phone_number,
        username=user.username,
        password_hash = hash_password(user.password),
        is_email_verified = False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
def get_user_by_school_email_or_username(db: Session, identifier: EmailStr) -> User | None:
    return db.query(User).filter(
        or_(User.school_email == identifier, User.username == identifier)
    ).first()
def get_user_by_school_email(db: Session, school_email: EmailStr) -> type[User] | None:
    return db.query(User).filter(User.school_email == school_email).first()

def get_user_by_username(db: Session, username: str) -> type[User] | None:
    return db.query(User).filter(User.username == username).first()

# Get specific user by default using their ID
def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.id == user_id).first()