import uuid
from uuid import UUID
from backend.app.core.r2 import s3_client
from backend.app.core.config import R2_BUCKET_NAME
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status,
    UploadFile
)
from sqlalchemy.orm import Session

from backend.app.crud import user_documents_crud as crud
from backend.app.schemas.user_documents import (
    User_DocumentsCreate,
    User_DocumentsUpdate,
    User_DocumentOut,
)
from backend.app.api.deps import get_db, get_current_user


router = APIRouter(
    prefix="/user-documents",
    tags=["user-documents"],
)


# ---------------------------------------------------------
# Upload Document
# ---------------------------------------------------------
@router.post("/", response_model=User_DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_user_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):



    # Generate unique R2 key
    r2_key = f"{current_user.user_id}/{uuid.uuid4()}_{file.filename}"

    # TODO: Upload to R2 here
    file_content = await file.read()
    s3_client.put_object(
        Bucket=R2_BUCKET_NAME,
        Key=r2_key,
        Body=file_content,
        ContentType=file.content_type,
        ACL='public-read',
    )
    # Generate public URL (or signed URL if private bucket)
    file_url = f"https://{R2_BUCKET_NAME}.r2.cloudflarestorage.com/{r2_key}"

    # Create schema object (WITHOUT file_url inside it)
    doc_in = User_DocumentsCreate(
        document_type=document_type,
    )

    # Correct keyword-only CRUD call
    document = crud.create_user_documents(
        db=db,
        user_id=current_user.user_id,
        document_in=doc_in,
        file_url=file_url,
    )

    return document


# ---------------------------------------------------------
# Get Single Document
# ---------------------------------------------------------
@router.get("/{user_document_id}", response_model=User_DocumentOut)
def read_user_document(
    user_document_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Get a single document belonging to the current user.
    """

    doc = crud.get_document(
        db=db,
        user_documents_id=user_document_id,
    )

    if not doc or doc.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or not authorized",
        )

    return doc


# ---------------------------------------------------------
# List All Documents for Current User
# ---------------------------------------------------------
@router.get("/", response_model=list[User_DocumentOut])
def list_user_documents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    List all documents owned by current user.
    """

    return crud.list_user_documents_by_user(
        db=db,
        user_id=current_user.user_id,
    )


# ---------------------------------------------------------
# Update Document (e.g. status or type)
# ---------------------------------------------------------
@router.put("/{user_document_id}", response_model=User_DocumentOut)
def update_user_document(
    user_document_id: UUID,
    user_document_in: User_DocumentsUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Update document metadata (not file).
    """

    doc = crud.get_document(
        db=db,
        user_documents_id=user_document_id,
    )

    if not doc or doc.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or not authorized",
        )

    return crud.update_user_document(
        db=db,
        document=doc,
        document_in=user_document_in,
    )


# ---------------------------------------------------------
# Delete Document
# ---------------------------------------------------------
@router.delete("/{user_document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_document(
    user_document_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Delete a document (and optionally remove from R2).
    """

    doc = crud.get_document(
        db=db,
        user_documents_id=user_document_id,
    )

    if not doc or doc.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or not authorized",
        )

    # TODO: delete from R2 storage here if needed

    crud.delete_user_document(
        db=db,
        document=doc,
    )

    return None





#Download a document 
from fastapi.responses import StreamingResponse
import io

@router.get("/{user_document_id}/download")
def download_user_document(
    user_document_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    doc = crud.get_document(
        db=db,
        user_documents_id=user_document_id,
    )

    if not doc or doc.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Not found")

    # Extract R2 key
    r2_key = doc.file_url.split(".com/")[-1]

    # Fetch from R2
    r2_object = s3_client.get_object(
        Bucket=R2_BUCKET_NAME,
        Key=r2_key,
    )

    file_stream = r2_object["Body"]

    return StreamingResponse(
        file_stream,
        media_type=r2_object["ContentType"],
        headers={
            "Content-Disposition": f"inline; filename={r2_key.split('/')[-1]}"
        },
    )