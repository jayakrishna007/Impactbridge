
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def check_db():
    # Attempt to load from backend/.env
    load_dotenv("backend/.env")
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME", "impactbridge")
    
    if not uri:
        print("MONGO_URI not found in environment")
        return

    print(f"Connecting to {db_name}...")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    # List all partnerships with messages
    cursor = db["partnerships"].find({"messages": {"$exists": True, "$ne": []}})
    count = 0
    async for p in cursor:
        count += 1
        print(f"Partnership {p.get('id')}: {len(p.get('messages', []))} messages")
        for m in p.get('messages', []):
            print(f"  [{m.get('time')}] {m.get('sender')}: {m.get('text')[:30]}...")
    
    if count == 0:
        print("No partnerships with messages found.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
