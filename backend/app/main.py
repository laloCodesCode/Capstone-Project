from fastapi import FastAPI


from routers import routes_user
from routers import routes_reports
from routers import routes_user_documents
from routers import routes_item_listing





from db.base import Base
from db.session import engine









app = FastAPI(title="Capstone Marketplace API")

@app.get("/health")
def health():
    return {"status": "ok"}




#including all the routers for user
app.include_router(user.router)
#including all the routers for the reports
app.include_router(reports.router)
app.include_router(routes_user_documents.router)
app.include_router(routes_item_listing.router)
