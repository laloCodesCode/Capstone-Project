from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.app.models.user_documents import UserDocuments
from backend.app.schemas.user_documents import User_DocumentsCreate, User_DocumentsUpdate


def create_user_documents(
    db: Session,
    *,
    user_id: UUID,
    document_in: User_DocumentsCreate,
    file_url: str,
) -> UserDocuments:
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


def get_document(
    db: Session,
    *,
    user_documents_id: UUID,
    user_id: Optional[UUID] = None
) -> Optional[UserDocuments]:
    stmt = select(UserDocuments).where(UserDocuments.user_documents_id == user_documents_id)
    if user_id:
        stmt = stmt.where(UserDocuments.user_id == user_id)
    return db.execute(stmt).scalar_one_or_none()


def list_user_documents_by_user(db: Session, *, user_id: UUID) -> list[UserDocuments]:
    stmt = (
        select(UserDocuments)
        .where(UserDocuments.user_id == user_id)
        .order_by(UserDocuments.uploaded_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def update_user_document(
    db: Session,
    *,
    document: UserDocuments,
    document_in: User_DocumentsUpdate,
) -> UserDocuments:
    data = document_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(document, field, value)
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def delete_user_document(db: Session, *, document: UserDocuments) -> None:
    db.delete(document)
    db.commit()
