from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.app.models import Message, MessageThread
from backend.app.models.favorite import Favorite
from backend.app.db.session import SessionLocal
from backend.app.models.user import User
from backend.app.models.listing import Listing


def run():
    db = SessionLocal()

    try:
        user = User(
            username="testuser2",
            school_email="test2@uncg.edu",
            phone_number="2222222222",
            password_hash="password"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("User created:", user.id)

        listing = Listing(
            title="Test Item 2",
            description="Testing relationships",
            price=10.0,
            seller_id=user.id,
            condition="new",
            location="Greensboro"
        )
        db.add(listing)
        db.commit()
        db.refresh(listing)
        print("Listing created:", listing.id)

        favorite = Favorite(
            user_id=user.id,
            listing_id=listing.id
        )
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
        print("Favorite created:", favorite.id)

        print("\nListing seller username:")
        print(listing.seller.username)

        print("\nUser listings:")
        for item in user.listings:
            print(item.title, item.price, item.location)

        found_user = db.scalar(select(User).where(User.username == "testuser2"))
        print("\nQueried user listings:")
        for item in found_user.listings:
            print(item.title, item.price, item.location)

        found_listing = db.scalar(select(Listing).where(Listing.title == "Test Item 2"))
        print("\nQueried listing seller:")
        print(found_listing.seller.username)

        print("\nFavorite relationships:")
        print(favorite.user.username)
        print(favorite.listing.title)

        print("\nUser favorites:")
        for fav in user.favorites:
            print(fav.listing.title)

        print("\nListing favorited by:")
        for fav in listing.favorites:
            print(fav.user.username)

        buyer = User(
            username="buyer1",
            school_email="buyer1@uncg.edu",
            phone_number="3333333333",
            password_hash="password"
        )
        db.add(buyer)
        db.commit()
        db.refresh(buyer)
        print("\nBuyer created:", buyer.id)

        thread = MessageThread(
            seller_id=user.id,
            buyer_id=buyer.id,
            listing_id=listing.id
        )
        db.add(thread)
        db.commit()
        db.refresh(thread)
        print("Thread created:", thread.id)

        message = Message(
            thread_id=thread.id,
            message_user=buyer.id,
            body="Hi, is this still available?"
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        print("Message created:", message.id)

        print("\nThread relationships:")
        print("Listing:", thread.listing.title)
        print("Buyer:", thread.buyer.username)
        print("Seller:", thread.seller.username)

        print("\nMessage relationships:")
        print("Sender:", message.sender.username)
        print("Thread listing:", message.thread.listing.title)

        print("\nBuyer threads:")
        for t in buyer.buyer_threads:
            print(t.id, t.listing.title)

        print("\nSeller threads:")
        for t in user.seller_threads:
            print(t.id, t.listing.title)

        print("\nListing threads:")
        for t in listing.threads:
            print(t.id, t.buyer.username, t.seller.username)

        print("\nThread messages:")
        for m in thread.messages:
            print(m.sender.username, ":", m.body)

        print("\nTesting duplicate favorite...")
        try:
            duplicate_fav = Favorite(
                user_id=user.id,
                listing_id=listing.id
            )
            db.add(duplicate_fav)
            db.commit()
            print("Duplicate favorite was allowed ❌")
        except IntegrityError:
            db.rollback()
            print("Duplicate favorite blocked ✅")

    finally:
        db.close()


if __name__ == "__main__":
    run()