from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.dependency import get_verified_user
from backend.app.crud.review import (
    create_review,
    get_review_by_reviewer_and_reviewed,
    get_reviews_by_reviewer,
    get_reviews_for_user, get_review_summary,
)
from backend.app.db.dependencies import get_db
from backend.app.models.user import User
from backend.app.schemas import ReviewCreate, ReviewResponse
from backend.app.schemas.review import ReviewSummaryResponse

review_router = APIRouter(prefix="/review", tags=["review"])


@review_router.post("/", response_model=ReviewResponse)
def create_new_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    if payload.reviewed_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot review yourself")

    existing_review = get_review_by_reviewer_and_reviewed(
        db=db,
        reviewer_id=current_user.id,
        reviewed_user_id=payload.reviewed_user_id,
    )

    if existing_review:
        raise HTTPException(status_code=409, detail="You already reviewed this user")

    return create_review(
        db=db,
        reviewer_id=current_user.id,
        reviewed_user_id=payload.reviewed_user_id,
        rating=payload.rating,
        comment=payload.comment,
    )

@review_router.get("/user/{user_id}/summary", response_model=ReviewSummaryResponse)
def get_user_review_summary(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    return get_review_summary(db=db, user_id=user_id)

@review_router.get("/user/{user_id}", response_model=list[ReviewResponse])
def get_user_reviews(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    return get_reviews_for_user(db=db, user_id=user_id)


@review_router.get("/me/received", response_model=list[ReviewResponse])
def get_my_received_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_reviews_for_user(db=db, user_id=current_user.id)


@review_router.get("/me/given", response_model=list[ReviewResponse])
def get_my_given_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return get_reviews_by_reviewer(db=db, reviewer_id=current_user.id)