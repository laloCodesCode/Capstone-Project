from fastapi import FastAPI

from backend.app.db import engine
from backend.app.db.base import Base
from backend.app.routers import (
    auth,
    item_image,
    message,
    message_thread,
    routes_item_listing,
    routes_reports,
    routes_user,
    routes_user_documents,
)

Base.metadata.create_all(bind=engine)


app = FastAPI(title="Capstone Marketplace API")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(message.router)
app.include_router(message_thread.router)
app.include_router(routes_item_listing.router)
app.include_router(routes_reports.router)
app.include_router(routes_user.router)
app.include_router(routes_user_documents.router)
app.include_router(auth.auth_router)
app.include_router(item_image.router)
