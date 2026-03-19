from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.favorite import Favorite


def get_favorite_by_user_and_listing(
    db: Session,
    user_id: UUID,
    listing_id: UUID,
) -> Favorite | None:
    return (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.listing_id == listing_id,
        )
        .first()
    )


def create_favorite(db: Session, user_id: UUID, listing_id: UUID) -> Favorite:
    favorite = Favorite(
        user_id=user_id,
        listing_id=listing_id,
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


def get_user_favorites(db: Session, user_id: UUID) -> list[type[Favorite]]:
    return (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


def delete_favorite(db: Session, favorite: Favorite) -> None:
    db.delete(favorite)
    db.commit()