# endpoints




import uuid 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.crud import user as crud_user
from backend.app.schemas.user import UserCreate, UserResponse
from backend.app.api.deps import get_db







# Router Instance 
router = APIRouter(prefix="/users", tags=["users"])



# Read the user ie obtain a single user by their UUID
@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found!")
    return db_user 

