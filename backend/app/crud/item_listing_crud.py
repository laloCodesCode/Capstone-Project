from __future__ import annotations

from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from backend.app.models.item_listing import ItemListing
# Need to make shcemas for create and update
from backend.app.schemas.item_listing import Item_ListingCreate, Item_ListingUpdate

# Create new item listing
def create_listing(db: Session, *, user_id: UUID, listing_in: Item_ListingCreate) -> ItemListing:
    listing = ItemListing(
        user_id=user_id,
        title=listing_in.title,
        description=listing_in.description,
        price=listing_in.price,
        is_active=True,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


# Get item listing
def get_listing(db: Session, *, listing_id: UUID) -> Optional[ItemListing]:
    return (
        db.query(ItemListing)
        .options(
            joinedload(ItemListing.owner),
            joinedload(ItemListing.images)
        )
        .filter(ItemListing.item_listing_id == listing_id)
        .first()
    )


# List all item listings
def list_listings(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 20,
    active_only: bool = True,
    user_id: Optional[UUID] = None,
) -> list[ItemListing]:
    query = (
        db.query(ItemListing)
        .options(
            joinedload(ItemListing.owner),
            joinedload(ItemListing.images)
        )
    )

    if active_only:
        query = query.filter(ItemListing.is_active == True)

    if user_id:
        query = query.filter(ItemListing.user_id == user_id)

    return (
        query
        .order_by(ItemListing.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

# Update item listing
def update_listing(db: Session, *, listing: ItemListing, listing_in: Item_ListingUpdate,) -> ItemListing:
    data = listing_in.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(listing, field, value)

        
    db.commit()
    db.refresh(listing)
    return listing
    


# Deactivate item listing
def deactivate_lisitng(db: Session, *, listing: ItemListing) -> ItemListing:
    listing.is_active = False
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


# Delete lisitng
def delete_lsiting(db: Session, *, listing: ItemListing) -> ItemListing:
    db.delete(listing)
    db.commit()
    return listing
    
