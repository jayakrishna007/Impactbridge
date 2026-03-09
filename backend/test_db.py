import asyncio
import database as db

async def test_conn():
    try:
        await db.connect_db()
        client = db.get_client()
        await client.admin.command('ping')
        print("CONNECTION_SUCCESS")
    except Exception as e:
        print("CONNECTION_ERROR:", e)

if __name__ == '__main__':
    asyncio.run(test_conn())
