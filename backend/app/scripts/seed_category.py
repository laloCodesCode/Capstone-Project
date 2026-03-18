from sqlalchemy.orm import Session

from backend.app.db.session import SessionLocal
from backend.app.models.category import Category


def get_or_create_category(db: Session, name: str, parent_id=None) -> Category:
    category = (
        db.query(Category)
        .filter(Category.name == name, Category.parent_id == parent_id)
        .first()
    )

    if category:
        return category

    category = Category(name=name, parent_id=parent_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def seed_categories():
    db = SessionLocal()
    try:
        clothing = get_or_create_category(db, "Clothing")
        electronics = get_or_create_category(db, "Electronics")
        textbooks = get_or_create_category(db, "Textbooks")
        furniture = get_or_create_category(db, "Furniture")


        get_or_create_category(db, "Shoes", clothing.id)
        get_or_create_category(db, "Shirts", clothing.id)
        get_or_create_category(db, "Pants", clothing.id)

        get_or_create_category(db, "Laptops", electronics.id)
        get_or_create_category(db, "Phones", electronics.id)
        get_or_create_category(db, "Headphones", electronics.id)

        get_or_create_category(db, "Math", textbooks.id)
        get_or_create_category(db, "Computer Science", textbooks.id)
        get_or_create_category(db, "Biology", textbooks.id)

        get_or_create_category(db, "Chairs", furniture.id)
        get_or_create_category(db, "Desks", furniture.id)


        print("Categories seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_categories()