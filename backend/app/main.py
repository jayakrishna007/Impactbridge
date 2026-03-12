from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.database.mongodb import MongoDB, get_db
from app.api import auth, proposals, partnerships, notifications
from app.websocket.chat_socket import manager
from app.utils import seed_csr_projects

# ── Lifespan ──────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB and prep indexes
    await MongoDB.connect()
    database = get_db()
    
    # Optional: Seed data if empty
    if await database["csr_projects"].count_documents({}) == 0:
        await seed_csr_projects(database)
        
    yield
    # Shutdown: Close DB
    await MongoDB.disconnect()

# ── App Initialization ────────────────────────────────────────────────────
app = FastAPI(
    title="ImpactBridge API",
    version="4.0.0",
    docs_url="/docs",
    lifespan=lifespan
)

# ── CORS ───────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
if ALLOWED_ORIGINS_ENV:
    for origin in ALLOWED_ORIGINS_ENV.split(","):
        origin = origin.strip()
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST Routes ───────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(auth.user_router)
app.include_router(proposals.router)
app.include_router(proposals.csr_router)
app.include_router(partnerships.router)
app.include_router(notifications.router)

# ── WebSocket Endpoint ────────────────────────────────────────────────────
@app.websocket("/ws/chat/{partnership_id}")
async def websocket_endpoint(websocket: WebSocket, partnership_id: str):
    await manager.connect(websocket, partnership_id)
    try:
        while True:
            # We mostly use WebSocket for RECEIVING broadcasts in this architecture.
            # But we can listen for "typing" or other events if needed.
            data = await websocket.receive_text()
            # For now, we don't do much with incoming WS data 
            # as messages are sent via POST /partnerships/{id}/chat
            print(f"📩 WS Received from {partnership_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, partnership_id)
    except Exception as e:
        print(f"❌ WS Error: {e}")
        manager.disconnect(websocket, partnership_id)

@app.get("/health")
async def health():
    return {"status": "ok", "architecture": "modular", "realtime": "websockets"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
