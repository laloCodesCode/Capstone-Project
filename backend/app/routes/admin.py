from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.config.settings import settings
from backend.app.core.dependency import get_admin_user
from backend.app.core.r2 import s3_client
from backend.app.db.dependencies import get_db
from backend.app.models import Review, ListingImage
from backend.app.models.listing import Listing
from backend.app.models.user import User

admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.delete("/listings/{listing_id}")
def admin_delete_listing(
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    listing = db.get(Listing, listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    db.delete(listing)
    db.commit()

    return {"message": "Listing deleted by admin"}

@admin_router.get("/users")
def admin_get_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "school_email": user.school_email,
            "is_admin": user.is_admin,
            "is_email_verified": user.is_email_verified,
        }
        for user in users
    ]

@admin_router.get("/users/{user_id}")
def admin_get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "school_email": user.school_email,
        "is_admin": user.is_admin,
        "is_email_verified": user.is_email_verified,
    }

@admin_router.patch("/users/{user_id}/make-admin")
def make_user_admin(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_admin = True
    db.commit()
    db.refresh(user)

    return {"message": f"{user.username} is now an admin"}

@admin_router.delete("/reviews/{review_id}")
def admin_delete_review(
    review_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    review = db.get(Review, review_id)

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()

    return {"message": "Review deleted by admin"}

@admin_router.delete("/listing-images/{image_id}")
def admin_delete_listing_image(
    image_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    image = db.get(ListingImage, image_id)

    if not image:
        raise HTTPException(status_code=404, detail="Listing image not found")

    r2_key = image.image_url.split(".com/")[-1]

    s3_client.delete_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
    )

    db.delete(image)
    db.commit()

    return {"message": "Listing image deleted by admin"}

@admin_router.patch("/users/{user_id}/ban")
def ban_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_banned = True
    db.commit()
    db.refresh(user)

    return {"message": f"{user.username} has been banned"}

@admin_router.patch("/users/{user_id}/unban")
def unban_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_banned = False
    db.commit()
    db.refresh(user)

    return {"message": f"{user.username} has been unbanned"}