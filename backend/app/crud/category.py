from sqlalchemy.orm import Session

from backend.app.models.category import Category



def get_categories(db: Session):
    return db.query(Category).all()