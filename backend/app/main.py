from fastapi import FastAPI

from backend.app.routers import message_thread, message


app = FastAPI(title="Capstone Marketplace API")

@app.get("/health")
def health():
    return {"status": "ok"}



app.include_router(message.router)
app.include_router(message_thread.router)
