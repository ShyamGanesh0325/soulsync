from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, chat, auth


from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoulSync API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, we can use * if allow_credentials is False
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Alternative if they NEED credentials (less likely for JWT):
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://soulsync-omega-sepia.vercel.app",
#         "https://soulsync-free.vercel.app",
#         "https://soulsync-ultimate.vercel.app",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "SoulSync API is running. use /api/predict_compatibility"}