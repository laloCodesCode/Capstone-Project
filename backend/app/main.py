from fastapi import FastAPI

app = FastAPI(title="Capstone Marketplace API")

@app.get("/health")
def health():
    return {"status": "ok"}