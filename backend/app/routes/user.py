import uuid
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from backend.app.core.dependency import get_verified_user
from backend.app.core.r2 import s3_client
from backend.app.config.settings import settings
from backend.app.crud.user import (
    get_user_by_id,
    get_public_user_listings,
    update_user_profile_image,
)
from backend.app.db.dependencies import get_db
from backend.app.models.user import User
from backend.app.schemas.user import (
    PublicUserProfileResponse,
    ProfileImageUploadResponse,
)
from fastapi.responses import StreamingResponse


user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.get("/{user_id}/profile", response_model=PublicUserProfileResponse)
def get_public_user_profile(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    listings = get_public_user_listings(db, user.id)

    return {
        "id": user.id,
        "username": user.username,
        "school_email": user.school_email,
        "profile_image_url": (
            f"{settings.BACKEND_BASE_URL}/users/{user.id}/profile-image"
            if user.profile_image_url
            else None
        ),
        "listings": listings,
    }


@user_router.post(
    "/me/profile-image",
    response_model=ProfileImageUploadResponse,
    status_code=status.HTTP_200_OK,
)
async def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    r2_key = f"profile-images/{current_user.id}/{uuid.uuid4()}_{file.filename}"
    file_content = await file.read()

    s3_client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
        Body=file_content,
        ContentType=file.content_type,
        ACL="public-read",
    )

    image_url = f"https://{settings.R2_BUCKET_NAME}.r2.cloudflarestorage.com/{r2_key}"

    update_user_profile_image(
        db=db,
        user=current_user,
        profile_image_url=image_url,
    )

    return {
        "profile_image_url": f"{settings.BACKEND_BASE_URL}/users/{current_user.id}/profile-image"
    }


@user_router.get("/{user_id}/profile-image")
def get_profile_image(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    user = get_user_by_id(db, user_id)

    if not user or not user.profile_image_url:
        raise HTTPException(status_code=404, detail="Profile image not found")

    r2_key = user.profile_image_url.split(".com/")[-1]

    r2_object = s3_client.get_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
    )

    return StreamingResponse(
        r2_object["Body"],
        media_type=r2_object["ContentType"],
        headers={"Content-Disposition": f"inline; filename={r2_key.split('/')[-1]}"},
    )
