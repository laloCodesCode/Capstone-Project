import uuid
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status,
)
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.app.core.r2 import s3_client
from backend.app.config.settings import settings

from backend.app.core.dependency import get_verified_user
from backend.app.crud import listing_image as crud
from backend.app.db.dependencies import get_db
from backend.app.schemas.listing_image import (
    ListingImageCreate,
    ListingImageOut,
)
from backend.app.models.listing import Listing


router = APIRouter(
    prefix="/listing-image",
    tags=["listing-image"],
)
@router.post("/", response_model=ListingImageOut, status_code=status.HTTP_201_CREATED)
async def upload_listing_image(
    listing_id: UUID = Form(...),
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    db: Session = Depends(get_db),
    current_user = Depends(get_verified_user),
):
    listing = db.get(Listing, listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this listing")

    r2_key = f"{current_user.id}/{uuid.uuid4()}_{file.filename}"

    file_content = await file.read()

    s3_client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
        Body=file_content,
        ContentType=file.content_type,
        ACL="public-read",
    )

    image_url = f"https://{settings.R2_BUCKET_NAME}.r2.cloudflarestorage.com/{r2_key}"

    image_in = ListingImageCreate(is_primary=is_primary)

    image = crud.create_listing_image(
        db=db,
        listing_id=listing_id,
        image_url=image_url,
        is_primary=image_in.is_primary,
    )

    return image
@router.get("/{image_id}", response_model=ListingImageOut)
def get_listing_image(
    image_id: UUID,
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_verified_user),
):
    image = crud.get_listing_image(
        db=db,
        image_id=image_id,
    )

    if not image or image.listing_id != listing_id:
        raise HTTPException(status_code=404, detail="Listing image not found")

    return image

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing_image(
    image_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_verified_user),
):
    image = crud.get_listing_image(db=db, image_id=image_id)

    if not image:
        raise HTTPException(status_code=404, detail="Listing image not found")

    listing = db.get(Listing, image.listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this listing")

    r2_key = image.image_url.split(".com/")[-1]

    s3_client.delete_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
    )

    crud.delete_listing_image(db=db, image=image)

@router.get("/{image_id}/download")
def download_listing_image(
    image_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_verified_user),
):
    image = crud.get_listing_image(
        db=db,
        image_id=image_id,
    )

    if not image:
        raise HTTPException(status_code=404, detail="Listing image not found")

    r2_key = image.image_url.split(".com/")[-1]

    r2_object = s3_client.get_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=r2_key,
    )

    return StreamingResponse(
        r2_object["Body"],
        media_type=r2_object["ContentType"],
        headers={
            "Content-Disposition": f"inline; filename={r2_key.split('/')[-1]}"
        },
    )


@router.get("/listing/{listing_id}", response_model=list[ListingImageOut])
def get_images_for_listing(
        listing_id: UUID,
        db: Session = Depends(get_db),
):
    return crud.list_listing_images_by_listing(
        db=db,
        listing_id=listing_id,
    )