from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, chat, auth


from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoulSync API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "SoulSync API is running. use /api/predict_compatibility"}