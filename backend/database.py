from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, errors
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

# ── MongoDB Connection ──────────────────────────────────────────────────────
# Set MONGO_URI in your .env file:
#   MONGO_URI=mongodb://localhost:27017        (local MongoDB)
#   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net  (MongoDB Atlas)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "impactbridge")

_client: AsyncIOMotorClient = None

def get_client() -> AsyncIOMotorClient:
    """Returns a globally connected MongoDB client. Lazily initializes if needed."""
    global _client
    if _client is None:
        print(f"📡 Initializing MongoDB client (lazy load) for {DB_NAME}...")
        # Use certifi for Atlas, omit or use default for local
        use_tls = "mongodb+srv" in MONGO_URI
        
        kwargs = {
            "serverSelectionTimeoutMS": 5000,
            "maxIdleTimeMS": 60000,  # Prevents idle drops in Atlas
            "connectTimeoutMS": 10000,
        }
        if use_tls:
            kwargs["tlsCAFile"] = certifi.where()

        _client = AsyncIOMotorClient(MONGO_URI, **kwargs)
    return _client

def get_db():
    """Return the database object for use in route handlers."""
    return get_client()[DB_NAME]

async def connect_db():
    """Call this on FastAPI startup to dry-run the DB connection and prep indexes."""
    try:
        client = get_client()
        db = client[DB_NAME]

        # Force a connection check
        await client.admin.command('ping')
        
        # ── Create indexes so queries stay fast ──────────────────────────────
        await db["users"].create_index([("email", ASCENDING)], unique=True)
        await db["ngo_proposals"].create_index([("id", ASCENDING)], unique=True)
        await db["individual_proposals"].create_index([("id", ASCENDING)], unique=True)
        await db["csr_projects"].create_index([("id", ASCENDING)], unique=True)
        await db["partnerships"].create_index([("id", ASCENDING)], unique=True)
        await db["partnerships"].create_index(
            [("proposalId", ASCENDING), ("proposalType", ASCENDING), ("funderEmail", ASCENDING)]
        )
        await db["notifications"].create_index([("id", ASCENDING)], unique=True)
        await db["notifications"].create_index([("recipientEmail", ASCENDING)])
        
        # ── Chats collection indexes ──
        await db["chats"].create_index([("partnershipId", ASCENDING)])
        await db["chats"].create_index([("createdAt", ASCENDING)])

        print(f"✅ Connected to MongoDB: {DB_NAME}")
    except errors.ServerSelectionTimeoutError as e:
        print(f"❌ MongoDB Connection Timeout: {e}")
        print("💡 Tip: Check your IP Whitelist in MongoDB Atlas and your internet connection.")
        raise
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        raise


async def close_db():
    """Call this on FastAPI shutdown."""
    global _client
    if _client:
        _client.close()
        _client = None
        print("🔌 MongoDB connection closed.")
