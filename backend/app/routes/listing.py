from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.dependency import get_verified_user
from backend.app.crud.listing import create_listing, get_listings, get_listing, delete_listing, update_listing, \
    get_my_listings
from backend.app.db.dependencies import get_db
from backend.app.models import User
from backend.app.schemas import ListingResponse, ListingCreate, ListingUpdate

listing_router = APIRouter(prefix="/listing", tags=["listing"])

@listing_router.post("/", response_model=ListingResponse)
def create_new_listing(
        listing: ListingCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_verified_user)
):
    return create_listing(db, listing, current_user.id)

@listing_router.get("/", response_model=list[ListingResponse])
def get_all_listings(
    category_id: UUID | None = None,
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    condition: str | None = None,
    status: str | None = None,
    q: str | None = None,
    sort: str|None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_listings(
        db=db,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        condition=condition,
        status=status,
        sort=sort,
        q=q,
        limit=limit,
        offset=offset,
    )

@listing_router.get("/me", response_model=list[ListingResponse])
def get_current_user_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_my_listings(db, current_user.id)
@listing_router.get("/{listing_id}", response_model=ListingResponse)
def get_single_listing(listing_id: UUID, db: Session = Depends(get_db)):
    listing = get_listing(db, listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    return listing
@listing_router.delete("/{listing_id}")
def remove_listing(listing_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_verified_user)):
    listing = get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    delete_listing(db, listing)
    return {"message": "Listing deleted"}

@listing_router.patch("/{listing_id}", response_model=ListingResponse)
def update_existing_listing(
    listing_id: UUID,
    payload: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user)
):

    listing = get_listing(db, listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return update_listing(db, listing, payload)

