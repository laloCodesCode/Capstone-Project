import uuid
from uuid import UUID
from backend.app.core.r2 import s3_client
from backend.app.core.config import R2_BUCKET_NAME
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status,
    UploadFile
)
from sqlalchemy.orm import Session

from backend.app.crud import item_image_crud as crud
from backend.app.schemas.item_image import (
    Item_ImageCreate,
    Item_ImageOut,
)
from backend.app.api.deps import get_db, get_current_user 

router = APIRouter(
    prefix="/item-images",
    tags=["item-images"],
)


# Upload item image
@router.post("/", response_model=Item_ImageOut, status_code=status.HTTP_201_CREATED)
async def upload_item_image(
    item_listing_id: UUID = Form(...),
    file: UploadFile = File(...),
    is_primary: bool = Form(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    
    # Generate unique R2 key
    r2_key = f"{current_user.user_id}/{uuid.uuid4()}_{file.filename}"

    # Upload to R2
    file_content = await file.read()
    s3_client.put_object(
        Bucket=R2_BUCKET_NAME,
        Key=r2_key,
        Body=file_content,
        ContentType=file.content_type,
        ACL='public-read',
    )
    # Generate public URL (or signed URL if private bucket)
    file_url = f"https://{R2_BUCKET_NAME}.r2.cloudflarestorage.com/{r2_key}"

    # Create schema object (WITHOUT file_url inside it)
    image_in = Item_ImageCreate(is_primary=is_primary)

    # Create DB record with file_url
    image = crud.create_item_image(
        db=db,
        item_listing_id=item_listing_id,
        image_in=image_in,
        file_url=file_url
    )

    return image

# Get single item image
@router.get("/{image_id}", response_model=Item_ImageOut)
def get_item_image(
    image_id: UUID,
    item_listing_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    image = crud.get_item_image(db=db, image_id=image_id, item_listing_id=item_listing_id)
    if not image:
        raise HTTPException(status_code=404, detail="Item image not found")
    return image


# Delete item image
@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_image(
    image_id: UUID,
    item_listing_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    image = crud.get_item_image(db=db, image_id=image_id, item_listing_id=item_listing_id)
    if not image:
        raise HTTPException(status_code=404, detail="Item image not found")
    
    
    # Delete DB record
    crud.delete_item_image(db=db, image=image)




# Download item image 
from fastapi.responses import StreamingResponse
import io

@router.get("/{image_id}/download")
def download_item_image(
    image_id: UUID,
    item_listing_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    image = crud.get_item_image(db=db, image_id=image_id, item_listing_id=item_listing_id)
    if not image:
        raise HTTPException(status_code=404, detail="Item image not found")
    
    # Download from R2
    r2_key = image.file_url.split(".com/")[-1]

    # Fetch from R2
    r2_object = s3_client.get_object(
        Bucket=R2_BUCKET_NAME,
        Key=r2_key,
    )

    file_stream = r2_object["Body"]
    
    return StreamingResponse(
        file_stream,
        media_type=r2_object["ContentType"],
        headers={
            "Content-Disposition": f"inline; filename={r2_key.split('/')[-1]}"
        },
    )