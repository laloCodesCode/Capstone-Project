from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# import models so they register with Base.metadata
from backend.app.models import user, item_listing, message, message_thread, reports, user_documents  # noqa: E402,F401