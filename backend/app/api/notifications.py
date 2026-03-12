from fastapi import APIRouter, HTTPException
from app.models.schemas import NotificationCreate
from app.database.mongodb import get_db
from app.utils import clean, push_notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("", status_code=201)
async def create_notification(data: NotificationCreate):
    database = get_db()
    notif = await push_notification(
        database,
        recipientEmail = data.recipientEmail,
        senderName     = data.senderName,
        notif_type     = data.type,
        title          = data.title,
        message        = data.message,
        linkHref       = data.linkHref,
        linkLabel      = data.linkLabel,
    )
    return clean(notif)

@router.get("/{email}/unread-count")
async def get_unread_count(email: str):
    database = get_db()
    count = await database["notifications"].count_documents(
        {"recipientEmail": email, "isRead": False}
    )
    return {"count": count}

@router.get("/{email}")
async def get_notifications(email: str, limit: int = 30):
    database = get_db()
    cursor = database["notifications"].find(
        {"recipientEmail": email}
    ).sort("createdAt", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [clean(d) for d in docs]

@router.put("/mark-all-read/{email}")
async def mark_all_read(email: str):
    database = get_db()
    await database["notifications"].update_many(
        {"recipientEmail": email, "isRead": False},
        {"$set": {"isRead": True}}
    )
    return {"status": "ok"}

@router.put("/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    database = get_db()
    result = await database["notifications"].update_one(
        {"id": notification_id},
        {"$set": {"isRead": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}
