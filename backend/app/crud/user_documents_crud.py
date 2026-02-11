from __future__ import annotations

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.user_documents import UserDocuments
from backend.app.schemas.user_documents import User_DocumentsCreate, User_DocumentsUpdate


# Create new user document
def create_user_documents(
    db: Session,
    *,
    user_id: UUID,
    document_in: User_DocumentsCreate,
    file_url: str,
) -> UserDocuments:
    """Create a new user document owned by user_id."""
    document = UserDocuments(
        user_id=user_id,
        document_type=document_in.document_type,
        file_url=file_url,
        status="PENDING",
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


# Get user document by id
def get_document(
    db: Session,
    *,
    user_documents_id: UUID,
) -> Optional[UserDocuments]:
    return db.get(UserDocuments, user_documents_id)


# Get list of user documents by user_id
def list_user_documents_by_user(
    db: Session,
    *,
    user_id: UUID,
) -> list[UserDocuments]:
    stmt = (
        select(UserDocuments)
        .where(UserDocuments.user_id == user_id)
        .order_by(UserDocuments.uploadedAt.desc())
    )
    return list(db.execute(stmt).scalars().all())


# Update user document
def update_user_document(
    db: Session,
    *,
    document: UserDocuments,
    document_in: User_DocumentsUpdate,
) -> UserDocuments:
    """Update a user document (e.g., status change)."""
    data = document_in.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(document, field, value)

    db.add(document)
    db.commit()
    db.refresh(document)
    return document


# Delete user document
def delete_user_document(
    db: Session,
    *,
    document: UserDocuments,
) -> None:
    """Delete a user document."""
    db.delete(document)
    db.commit()