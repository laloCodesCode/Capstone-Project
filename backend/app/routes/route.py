from fastapi import Depends, APIRouter
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.app.db.dependencies import get_db

router = APIRouter()

@router.get("/test")
def test(db: Session = Depends(get_db)):
    return {"message": "Hello World"}


@router.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    return {"database": "connected", "result": result.scalar()}