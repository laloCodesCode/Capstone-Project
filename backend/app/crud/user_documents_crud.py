from __future__ import annotations
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.user_documents import User_Documents
from app.schemas.user_documents import User_DocumentsCreate, User_DocumentsUpdate

# Create new user document
def create_user_documents(db: Session,
    *,
    user_id: UUID,
    document_in: User_DocumentsCreate,
    file_url: str,
    ) -> User_Documents:

    """Create a new user document owned by uuid user_id"""
    document = User_Documents(
        user_id=user_id,
        document_type=document_in.document_type,
        file_url=file_url,
        status="PENDING",
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

# Get user document
def get_document(db: Session,
    *,
    user_documents_id: UUID,
    ) -> Optional[User_Documents]:
    return db.ge(User_Documents, user_documents_id)


# Get list of user documents by user_id
def list_user_documents_by_user(db: Session,
    *,
    user_id: UUID,
    ) -> list[User_Documents]:
    stmt = select(User_Documents).where(User_Documents.user_id == user_id).order_by(User_Documents.uploadedAt.desc())
    return list(db.execute(stmt).scalars().all())


# Update user document
def upddate_upser_document(db: Session,
        *,
        document: User_Documents,
        document_in: User_DocumentsUpdate,
        ) -> User_Documents:
    
    """For admin to chnage document status or update document info"""

    data = document_in.model_dump(exclude_unset=True)

    for field, vlaue in data.items():
        setattr(document, field, value)

        db.add()
        db.commit()
        db.refresh(document)
        return document
    
# Delete user document
def delete_user_document(db: Session,
    *,
    document: User_Documents,
    ) -> None:
    """Delete a user document"""
    db.delete(document)
    db.commit()