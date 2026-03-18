from typing import Any
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.models.review import Review


def get_review_by_reviewer_and_reviewed(
    db: Session,
    *,
    reviewer_id: UUID,
    reviewed_user_id: UUID,
) -> Review | None:
    return (
        db.query(Review)
        .filter(
            Review.reviewer_id == reviewer_id,
            Review.reviewed_user_id == reviewed_user_id,
        )
        .first()
    )


def create_review(
    db: Session,
    *,
    reviewer_id: UUID,
    reviewed_user_id: UUID,
    rating: int,
    comment: str | None,
) -> Review:
    review = Review(
        reviewer_id=reviewer_id,
        reviewed_user_id=reviewed_user_id,
        rating=rating,
        comment=comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_reviews_for_user(db: Session, *, user_id: UUID) -> list[type[Review]]:
    return (
        db.query(Review)
        .filter(Review.reviewed_user_id == user_id)
        .order_by(Review.created_at.desc())
        .all()
    )


def get_reviews_by_reviewer(db: Session, *, reviewer_id: UUID) -> list[type[Review]]:
    return (
        db.query(Review)
        .filter(Review.reviewer_id == reviewer_id)
        .order_by(Review.created_at.desc())
        .all()
    )

def get_review_summary(db: Session, *, user_id: UUID) -> dict:
    average_rating, review_count = (
        db.query(
            func.avg(Review.rating),
            func.count(Review.id),
        )
        .filter(Review.reviewed_user_id == user_id)
        .first()
    )

    return {
        "user_id": user_id,
        "average_rating": round(float(average_rating), 1) if average_rating is not None else 0.0,
        "review_count": review_count,
    }