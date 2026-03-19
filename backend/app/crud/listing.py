from uuid import UUID

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session

from backend.app.models import Listing
from backend.app.schemas.listing import ListingCreate, ListingUpdate


def create_listing(db: Session, listing: ListingCreate, seller_id: UUID) -> Listing:
    listing = Listing(
        title=listing.title,
        description=listing.description,
        price=listing.price,
        condition=listing.condition,
        location=listing.location,
        category_id=listing.category_id,
        seller_id=seller_id,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing
def get_listing(db:Session, listing_id: UUID):
    return db.query(Listing).filter(Listing.id == listing_id).first()

def get_listings(
        db:Session,
        category_id: UUID | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        condition: str | None = None,
        status: str | None = None,
        limit: int = 20,
        offset: int = 0,
        sort: str | None = None,
        q: str | None = None,

):
    query = db.query(Listing)
    if category_id:
        query = query.filter(Listing.category_id == category_id)

    if min_price is not None:
        query = query.filter(Listing.price >= min_price)

    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    if condition:
        query = query.filter(Listing.condition == condition)

    if status:
        query = query.filter(Listing.status == status)

    if q:
        query = query.filter(
            or_(
                Listing.title.ilike(f"%{q}%"),
                Listing.description.ilike(f"%{q}%"),
            )
        )

    #sorting
    if sort == "price_asc":
        query = query.order_by(asc(Listing.price))

    elif sort == "price_desc":
        query = query.order_by(desc(Listing.price))

    elif sort == "newest":
        query = query.order_by(desc(Listing.created_at))

    else:
        query = query.order_by(desc(Listing.created_at))

    return query.offset(offset).limit(limit).all()

def delete_listing(db: Session, listing: Listing):
    db.delete(listing)
    db.commit()

def update_listing(db: Session, listing: Listing, payload: ListingUpdate) -> Listing:
    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing

def get_my_listings(db: Session, seller_id: UUID):
    return db.query(Listing).filter(Listing.seller_id == seller_id).all()