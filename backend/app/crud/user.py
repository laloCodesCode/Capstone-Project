"""
CREATE : Create a new user, by deafult "USER"
READ: Look at a certain user or a collection of users
UPDATE: Change a couple aspects of the user
DELETE: Remove a user
"""
import uuid 
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate

# New user
# NOTE: password is NOT yet hashed
def create_user(db: Session, user: UserCreate):
    db_user = User(first_name=user.first_name, last_name=user.last_name, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get specific user by default using their ID
def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.user_id == user_id).fist()

# Get specific user by email
#def get_user_by_email(db: Session, email: str):
    return db.query(User).offset(skip).limit(limit).all()

# Get a collection of users
def get_users(db: Session, skip: int = 0, limit : int = 100):
    return db.query(User).offset(skip).limit(limit).all()


