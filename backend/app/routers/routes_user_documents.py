import uuid 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.crud import user_documents_crud as crud_user_documents
from backend.app.schemas.user_documents import User_DocumentsCreate, User_DocumentsUpdate, User_DocumentOut
from backend.app.api.deps import get_db


router = APIRouter(prefix="/user-documents", tags=["user-documents"])

# For uploading docs 
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Route to create new user document tied with a user
@router.post("/", response_model=User_DocumentOut)
def create_user_document_endpoint(user_document: User_DocumentsCreate, db: Session = Depends(get_db)):
    return crud_user_documents.create_user_document(db, user_document)  


# Route to read a user doc by uts uuid
@router.get("/{user_document_id}", response_model=User_DocumentOut)
def read_user_document(user_document_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user_document = crud_user_documents.get_document(db, user_document_id)
    if not db_user_document:
        raise HTTPException(status_code=404, detail="User document not found!")
    return db_user_document


# Route to update a user doc by its uuid
@router.put("/{user_document_id}", response_model=User_DocumentOut)
def update_user_document_endpoint(user_document_id: uuid.UUID, user_document: User_DocumentsUpdate, db: Session = Depends(get_db)):
    db_user_document = crud_user_documents.get_document(db, user_document_id)

    if not db_user_document:
        raise HTTPException(status_code=404, detail="User document not found!")
    
    if db_user_document.user_id != user_document.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user document!")
    
    return crud_user_documents.update_user_document(db, user_document=db_user_document, user_document_in= user_document)