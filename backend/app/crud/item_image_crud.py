from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.app.models.item_image import ItemImage
from backend.app.schemas.item_image import Item_ImageCreate


# Add item image to listing
def create_item_image(
    db: Session,
    *,
    item_listing_id: UUID,
    image_in: Item_ImageCreate,
    file_url: str,
) -> ItemImage:
    image = ItemImage(
        item_listing_id=item_listing_id,
        file_url=file_url,
        is_primary=image_in.is_primary,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image

# Get item image
def get_item_image(
    db: Session,
    *,
    image_id: UUID,
    item_listing_id: Optional[UUID] = None
) -> Optional[ItemImage]:
    stmt = select(ItemImage).where(ItemImage.image_id == image_id)
    if item_listing_id:
        stmt = stmt.where(ItemImage.item_listing_id == item_listing_id)
    return db.execute(stmt).scalar_one_or_none()


# List item images by listing
def list_item_images_by_listing(db: Session, *, item_listing_id: UUID) -> list[ItemImage]:
    stmt = (
        select(ItemImage)
        .where(ItemImage.item_listing_id == item_listing_id)
        .order_by(ItemImage.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())

# Delete item image
def delete_item_image(db: Session, *, image: ItemImage) -> None:
    db.delete(image)
    db.commit()