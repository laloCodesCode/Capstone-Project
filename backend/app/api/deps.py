from fastapi import Depends
from sqlalchemy.orm import Session

from backend.app.db import SessionLocal


def get_db():
    with SessionLocal() as db:
        yield db

def get_current_user(
        db: Session = Depends(get_db),

):
