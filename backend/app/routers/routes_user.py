# endpoints




import uuid 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.crud import user as crud_user
from backend.app.schemas.user import UserCreate, UserResponse
from backend.app.api.deps import get_db







# Router Instance 
router = APIRouter(prefix="/users", tags=["users"])

# Router to create a new user making sure the user does not already exsit 
@router.post("/", response_model=UserResponse)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    exsiting_user = crud_user.get_user_by_email(db, user.email)
    if exsiting_user: 
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create_user(db, user)




# Read the user ie obtain a single user by their UUID
@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found!")
    return db_user 
