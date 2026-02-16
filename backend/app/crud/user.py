"""
CREATE : Create a new user, by deafult "USER"
READ: Look at a certain user or a collection of users
UPDATE: Change a couple aspects of the user
DELETE: Remove a user
"""
import uuid
from typing import Any

from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.app.core.security import hash_password
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate

# New user
# NOTE: password is NOT yet hashed
def create_user(db: Session, user: UserCreate) -> User:
    user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        password=hash_password(user.password),
        role="USER",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str) -> type[User] | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> type[User] | None:
    return db.query(User).filter(User.username == username).first()

# Get specific user by default using their ID
def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.user_id == user_id).fist()

def get_user_by_email_or_username(db: Session, identifier: str) -> User | None:
    return db.query(User).filter(
        or_(User.email == identifier, User.username == identifier)
    ).first()

# Get a collection of users
def get_users(db: Session, skip: int = 0, limit : int = 100):
    return db.query(User).offset(skip).limit(limit).all()


