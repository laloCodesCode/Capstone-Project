from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.listing_image import ListingImage


def create_listing_image(
    db: Session,
    *,
    listing_id: UUID,
    image_url: str,
    is_primary: bool,
) -> ListingImage:
    image = ListingImage(
        listing_id=listing_id,
        image_url=image_url,
        is_primary=is_primary,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


def get_listing_image(
    db: Session,
    *,
    image_id: UUID,
) -> ListingImage | None:
    stmt = select(ListingImage).where(ListingImage.id == image_id)
    return db.execute(stmt).scalar_one_or_none()


def list_listing_images_by_listing(
    db: Session,
    *,
    listing_id: UUID,
) -> list[ListingImage]:
    stmt = (
        select(ListingImage)
        .where(ListingImage.listing_id == listing_id)
        .order_by(ListingImage.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def delete_listing_image(
    db: Session,
    *,
    image: ListingImage,
) -> None:
    db.delete(image)
    db.commit()