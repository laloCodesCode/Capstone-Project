import uuid 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.crud import item_listing_crud as crud_item_listing
from backend.app.schemas.item_listing import Item_ListingCreate, Item_ListingBase, Item_ListingUpdate, Item_ListingOut
from backend.app.api.deps import get_db, get_current_user

router = APIRouter(prefix="/item-listing", tags=["item-listing"])

# Route to create new item listing tied with a user
@router.post("", response_model=Item_ListingOut)
def create_item_listing_endpoint(
    item_listing: Item_ListingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):    return crud_item_listing.create_listing(
        db=db,
        user_id=current_user.id,
        listing_in=item_listing
)


# Route to get all listings
@router.get("", response_model=list[Item_ListingOut])
def get_all_item_listings(db: Session = Depends(get_db)):
    return crud_item_listing.list_listings(db)



# Route to read an item listing by its UUID
@router.get("/{item_listing_id}", response_model=Item_ListingOut)
def read_item_listing(item_listing_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item_listing = crud_item_listing.get_listing(db, item_listing_id)
    if not db_item_listing:
        raise HTTPException(status_code=404, detail="Item listing not found!")
    return db_item_listing


# Route to update an item listing by its UUID
@router.put("/{item_listing_id}", response_model=Item_ListingOut)
def update_item_listing_endpoint(item_listing_id: uuid.UUID, item_listing: Item_ListingUpdate, db: Session = Depends(get_db)):
    db_item_listing = crud_item_listing.get_listing(db, item_listing_id)

    if not db_item_listing:
        raise HTTPException(status_code=404, detail="Item listing not found!")
    
    if db_item_listing.user_id != item_listing.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this item listing!")
    
    return crud_item_listing.update_listing(db, listing=db_item_listing, listing_in= item_listing)


# Route to delete 
@router.delete("/{item_listing_id}")
def delete_listing(item_listing_id: uuid.UUID, db: Session = Depends(get_db)):
    listing = crud_item_listing.get_listing(db, listing_id=item_listing_id)
    if not listing:
        raise HTTPException(404, "Not found")
    return crud_item_listing.delete_listing(db, listing=listing)