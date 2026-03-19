from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.models import Category
from backend.app.schemas import  CategoryResponse
from backend.app.crud.category import  get_categories
from backend.app.db.dependencies import get_db

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    return get_categories(db)


@router.get("/{category_id}")
def get_subcategories(category_id: str, db: Session = Depends(get_db)):
    subcategories = db.query(Category).filter(Category.parent_id == category_id).all()
    return subcategories