from fastapi import FastAPI

from backend.app.routes.auth import auth_router
from backend.app.routes.favorites import favorite_router
from backend.app.routes.listing import listing_router
from backend.app.routes.message import message_router
from backend.app.routes.route import router
from backend.app.routes.category import router as category_router
from backend.app.routes.listing_image import router as listing_image
from backend.app.routes.notification import notification_router
from backend.app.routes.review import review_router
from backend.app.routes.admin import admin_router
app = FastAPI()
app.include_router(router)
app.include_router(auth_router)
app.include_router(listing_router)
app.include_router(category_router)
app.include_router(message_router)
app.include_router(favorite_router)
app.include_router(listing_image)
app.include_router(notification_router)
app.include_router(review_router)
app.include_router(admin_router)