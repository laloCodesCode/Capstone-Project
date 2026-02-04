from fastapi import FastAPI

from routers import routes_user
from routers import routes_reports
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
