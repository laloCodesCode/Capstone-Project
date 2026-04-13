from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.config.settings import settings
from backend.app.core.dependency import get_verified_user
from backend.app.crud.favorite import (
    create_favorite,
    delete_favorite,
    get_favorite_by_user_and_listing,
    get_user_favorites,
)
from backend.app.crud.notification import create_notification
from backend.app.db.dependencies import get_db
from backend.app.models import Listing
from backend.app.models.user import User
from backend.app.schemas import FavoriteResponse, FavoriteListingResponse

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
            actor_user_id=current_user.id,
            listing_id=listing_id,
            type="favorite",
            content=f"{current_user.username} liked your listing",
        )

    return favorite


@favorite_router.get("/", response_model=list[FavoriteListingResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    favorites = get_user_favorites(db, current_user.id)

    results = []

    for favorite in favorites:
        listing = favorite.listing

        image_to_use = None
        if listing and listing.images:
            image_to_use = next(
                (image for image in listing.images if image.is_primary),
                None,
            )
            if image_to_use is None:
                image_to_use = listing.images[0]

        results.append(
            {
                "id": favorite.id,
                "listing_id": favorite.listing_id,
                "user_id": favorite.user_id,
                "created_at": favorite.created_at,
                "title": listing.title,
                "price": listing.price,
                "location": listing.location,
                "status": listing.status,
                "listing_image_url": (
                    f"{settings.BACKEND_BASE_URL}/listing-image/{image_to_use.id}/download"
                    if image_to_use
                    else None
                ),
            }
        )

    return results

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