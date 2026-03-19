from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.dependency import get_verified_user
from backend.app.crud.favorite import (
    create_favorite,
    delete_favorite,
    get_favorite_by_user_and_listing,
    get_user_favorites,
)
from backend.app.crud.notification import create_notification
from backend.app.db.dependencies import get_db, get_current_user
from backend.app.models import Listing
from backend.app.models.user import User
from backend.app.schemas import FavoriteResponse

favorite_router = APIRouter(prefix="/favorites", tags=["favorites"])


@favorite_router.post("/{listing_id}", response_model=FavoriteResponse)
def add_favorite(
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    existing_favorite = get_favorite_by_user_and_listing(
        db,
        current_user.id,
        listing_id,
    )

    if existing_favorite:
        return existing_favorite

    favorite = create_favorite(db, current_user.id, listing_id)

    listing = db.get(Listing, listing_id)

    if listing and listing.seller_id != current_user.id:
        create_notification(
            db=db,
            user_id=UUID(str(listing.seller_id)),
            type="favorite",
            content="Someone favorited your listing",
        )

    return favorite


@favorite_router.get("/", response_model=list[FavoriteResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_user_favorites(db, current_user.id)


@favorite_router.delete("/{listing_id}")
def remove_favorite(
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    favorite = get_favorite_by_user_and_listing(
        db,
        current_user.id,
        listing_id,
    )

    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    delete_favorite(db, favorite)

    return {"message": "Favorite removed"}