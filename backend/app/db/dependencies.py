from uuid import UUID

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.app.core.token import decode_access_token
from backend.app.db.session import SessionLocal
from backend.app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(
                status_code=401, detail="Could not validate credentials"
            )
        user = db.get(User, UUID(sub))
        if not user:
            raise HTTPException(
                status_code=401, detail="User not found",
            )
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="The token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=404, detail="The token is invalid",
        )


