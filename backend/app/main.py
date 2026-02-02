from fastapi import FastAPI

from routers import routes_user
from db.base import Base 
from db.session import engine









app = FastAPI(title="Capstone Marketplace API")

@app.get("/health")
def health():
    return {"status": "ok"}




#including all the routers for user 
app.include_router(user.router)
