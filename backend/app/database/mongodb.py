from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, errors
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "impactbridge")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        if cls.client is not None:
            return

        print(f"📡 Connecting to MongoDB: {DB_NAME}...")
        use_tls = "mongodb+srv" in MONGO_URI
        
        kwargs = {
            "serverSelectionTimeoutMS": 5000,
            "maxIdleTimeMS": 60000,
            "connectTimeoutMS": 10000,
        }
        if use_tls:
            kwargs["tlsCAFile"] = certifi.where()

        cls.client = AsyncIOMotorClient(MONGO_URI, **kwargs)
        cls.db = cls.client[DB_NAME]

        try:
            await cls.client.admin.command('ping')
            await cls._ensure_indexes()
            print(f"✅ Connected to MongoDB: {DB_NAME}")
        except Exception as e:
            print(f"❌ MongoDB Connection Error: {e}")
            raise

    @classmethod
    async def _ensure_indexes(cls):
        db = cls.db
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

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            cls.client = None
            cls.db = None
            print("🔌 MongoDB connection closed.")

def get_db():
    return MongoDB.db
