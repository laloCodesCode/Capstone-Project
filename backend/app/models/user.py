import uuid 
from sqlalchemy import String, DateTime 
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func


from app.db.base import Base

class User(Base):
    _tablename_ = "Users"

    # Uses UUID utility to create user_id
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Create first name
    first_name: Mapped[str] = mapped_column(String(20), nullable=False)
        

    # Create last name
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)


    # Create user email
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)


    # Create password
    passworrd: Mapped[str] = mapped_column(String(500), nullable=False)


    # Create role
    # Default type = USER
    role: Mapped[str] = mapped_column(String(30), nullble=False, default="USER")



    # TODO: Add realtions!


