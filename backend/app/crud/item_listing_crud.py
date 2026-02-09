from __future__ import annotations

from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.item_listing import Item_Listing
# Need to make shcemas for create and update
from app.schemas.item_listing import Item_ListingCreate, Item_ListingUpdate

# Create new item listing
def create_listing(db: Session, *, user_id: UUID, listing_in: Item_ListingCreate) -> Item_Listing:
    """Create a new item listing owned by uuid user_id."""
    listing = Item_Listing(
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
def get_listing(db: Session, *, listing_id: UUID) -> Optional[Item_Listing]:
    """Get an item listing by its listing_id."""
    return db.get(Item_Listing, listing_id)


# List all item listings
def list_listings(db: Session, *, skip: int = 0, limit: int = 20, active_only: bool = True, user_id: Optional[UUID] = None,) -> list[Item_Listing]:
    """List all item listings with pagination."""
    stmt = select(Item_Listing)
    if active_only:
        stmt = stmt.where(Item_Listing.is_active == True)
    if user_id:
        stmt = stmt.where(Item_Listing.user_id == user_id)

    stmt = stmt.order_by(Item_Listing.createdAt.desc()).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# Update item listing
def update_listing(db: Session, *, listing: Item_Listing, listing_in: Item_ListingUpdate,) -> Item_Listing:
    data = listing_in.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(listing, field, value)

        
    db.commit()
    db.refresh(listing)
    return listing
    


# Deactivate item listing
def deactivate_lisitng(db: Session, *, listing: Item_Listing) -> Item_Listing:
    listing.is_active = False
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


# Delete lisitng
def delete_lsiting(db: Session, *, listing: Item_Listing) -> Item_Listing:
    db.delete(listing)
    db.commit()
    return listing
    
