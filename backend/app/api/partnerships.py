from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from typing import Dict, Any, List
from app.models.schemas import PartnershipCreate, MouSignRequest, ChatMessage
from app.database.mongodb import get_db
from app.utils import clean, push_notification
from app.websocket.chat_socket import manager

router = APIRouter(prefix="/partnerships", tags=["Partnerships"])

@router.post("", status_code=201)
async def create_or_get_partnership(data: PartnershipCreate):
    database = get_db()
    col = database["partnerships"]

    existing = await col.find_one({
        "proposalId":   data.proposalId,
        "proposalType": data.proposalType,
        "funderEmail":  data.funderEmail,
    })
    if existing:
        return clean(existing)

    partnership = {
        "id":               f"pship-{uuid.uuid4().hex[:10]}",
        "proposalId":       data.proposalId,
        "proposalType":     data.proposalType,
        "proposalTitle":    data.proposalTitle,
        "funderEmail":      data.funderEmail,
        "funderName":       data.funderName,
        "partnerEmail":     data.partnerEmail,
        "partnerName":      data.partnerName,
        "funderConfirmed":  False,
        "partnerConfirmed": False,
        "status":           "pending",
        "createdAt":        datetime.utcnow().isoformat(),
        "funderConfirmedAt":  None,
        "partnerConfirmedAt": None,
        "docsVerified": False,
        "mouUploaded": False,
        "mouSignatures": {
            "funder": False,
            "partner": False,
            "funderSignedAt": None,
            "partnerSignedAt": None
        }
    }
    await col.insert_one(partnership)

    # Seed initial messages into the new CHATS collection
    initial_messages = [
        {
            "partnershipId": partnership["id"],
            "sender": "funder",
            "name": data.funderName,
            "initials": data.funderName[0].upper() if data.funderName else "F",
            "text": "We've reviewed your trust deed. Looks great. Could you also share the FCRA certificate to proceed with the MOU?",
            "time": "10:30 AM",
            "createdAt": datetime.utcnow().isoformat(),
        },
        {
            "partnershipId": partnership["id"],
            "sender": "partner",
            "name": data.partnerName,
            "initials": data.partnerName[0].upper() if data.partnerName else "P",
            "text": "Sure! Uploading it right now to the portal.",
            "time": "11:15 AM",
            "createdAt": datetime.utcnow().isoformat(),
        }
    ]
    await database["chats"].insert_many(initial_messages)

    return clean(partnership)

@router.get("/for-user/{email}")
async def get_partnerships_for_user(email: str):
    database = get_db()
    cursor = database["partnerships"].find({
        "$or": [{"funderEmail": email}, {"partnerEmail": email}]
    }).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@router.put("/{partnership_id}/funder-confirm")
async def funder_confirm(partnership_id: str):
    database = get_db()
    col = database["partnerships"]

    p = await col.find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")

    now = datetime.utcnow().isoformat()
    update: Dict[str, Any] = {"funderConfirmed": True, "funderConfirmedAt": now}
    if p.get("partnerConfirmed"):
        update["status"] = "active"

    await col.update_one({"id": partnership_id}, {"$set": update})
    updated = await col.find_one({"id": partnership_id})

    if p.get("partnerEmail"):
        await push_notification(
            database,
            recipientEmail = p["partnerEmail"],
            senderName     = p.get("funderName", "A Funder"),
            notif_type     = "fund_interest",
            title          = "A Funder is Interested!",
            message        = f"{p.get('funderName', 'A funder')} is interested in funding \"{p.get('proposalTitle', 'your proposal')}\" and has confirmed on their end. Click here to review and accept the partnership.",
            linkHref       = f"/partnership/{p['proposalType']}/{p['proposalId']}",
            linkLabel      = "Accept Partnership Now",
        )

    return clean(updated)

@router.put("/{partnership_id}/partner-confirm")
async def partner_confirm(partnership_id: str):
    database = get_db()
    col = database["partnerships"]

    p = await col.find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")

    now = datetime.utcnow().isoformat()
    update: Dict[str, Any] = {"partnerConfirmed": True, "partnerConfirmedAt": now}
    if p.get("funderConfirmed"):
        update["status"] = "active"

    await col.update_one({"id": partnership_id}, {"$set": update})
    updated = await col.find_one({"id": partnership_id})

    if p.get("funderEmail"):
        await push_notification(
            database,
            recipientEmail = p["funderEmail"],
            senderName     = p.get("partnerName", "Your Partner"),
            notif_type     = "partner_confirmed",
            title          = "🎉 Partnership Accepted!",
            message        = f"{p.get('partnerName', 'The organization')} accepted your partnership for \"{p.get('proposalTitle', 'the proposal')}\". Your partnership is now active!",
            linkHref       = f"/partnership/{p['proposalType']}/{p['proposalId']}",
            linkLabel      = "View Active Partnership",
        )

    return clean(updated)

@router.get("/{proposal_type}/{proposal_id}")
async def get_partnership_for_proposal(proposal_type: str, proposal_id: str, funder_email: str):
    database = get_db()
    doc = await database["partnerships"].find_one({
        "proposalId":   proposal_id,
        "proposalType": proposal_type,
        "funderEmail":  funder_email,
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Partnership not found")
    return clean(doc)

@router.put("/{partnership_id}/mou-upload")
async def upload_partnership_mou(partnership_id: str):
    database = get_db()
    col = database["partnerships"]

    p = await col.find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")

    await col.update_one({"id": partnership_id}, {"$set": {"mouUploaded": True}})
    updated = await col.find_one({"id": partnership_id})

    if p.get("partnerEmail"):
        await push_notification(
            database,
            recipientEmail = p["partnerEmail"],
            senderName     = p.get("funderName", "Your Funder"),
            notif_type     = "mou_uploaded",
            title          = "📄 MOU Agreement Ready for Review",
            message        = f"{p.get('funderName', 'The funder')} has uploaded the official MOU for \"{p.get('proposalTitle', 'the proposal')}\". Please review the terms, accept the conditions, and digitally sign it.",
            linkHref       = f"/partnership/{p['proposalType']}/{p['proposalId']}",
            linkLabel      = "Review and Sign MOU",
        )

    return clean(updated)

@router.put("/{partnership_id}/mou-sign")
async def sign_partnership_mou(partnership_id: str, data: MouSignRequest):
    database = get_db()
    col = database["partnerships"]

    p = await col.find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")
        
    mou_sigs = p.get("mouSignatures", {
        "funder": False,
        "partner": False,
        "funderSignedAt": None,
        "partnerSignedAt": None
    })
    
    now = datetime.utcnow().isoformat()
    if data.role == "funder":
        mou_sigs["funder"] = True
        mou_sigs["funderSignedAt"] = now
        
        if p.get("partnerEmail"):
            await push_notification(
                database,
                recipientEmail = p["partnerEmail"],
                senderName     = p.get("funderName", "Your Funder"),
                notif_type     = "mou_signed",
                title          = "✍️ MOU Signed by Funder",
                message        = f"{p.get('funderName', 'The funder')} has digitally signed the MOU for \"{p.get('proposalTitle', 'the proposal')}\".",
                linkHref       = f"/partnership/{p['proposalType']}/{p['proposalId']}",
                linkLabel      = "View Signed MOU",
            )
            
    elif data.role == "partner":
        mou_sigs["partner"] = True
        mou_sigs["partnerSignedAt"] = now
        
        if p.get("funderEmail"):
            await push_notification(
                database,
                recipientEmail = p["funderEmail"],
                senderName     = p.get("partnerName", "Your Partner"),
                notif_type     = "mou_signed",
                title          = "✍️ MOU Signed by Partner",
                message        = f"{p.get('partnerName', 'The partner')} has reviewed and digitally signed the MOU for \"{p.get('proposalTitle', 'the proposal')}\".",
                linkHref       = f"/partnership/{p['proposalType']}/{p['proposalId']}",
                linkLabel      = "View Signed MOU",
            )
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    await col.update_one({"id": partnership_id}, {"$set": {"mouSignatures": mou_sigs}})
    updated = await col.find_one({"id": partnership_id})
    return clean(updated)

@router.put("/{partnership_id}/verify-docs")
async def verify_partnership_docs(partnership_id: str):
    database = get_db()
    col = database["partnerships"]

    p = await col.find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")

    await col.update_one({"id": partnership_id}, {"$set": {"docsVerified": True}})
    updated = await col.find_one({"id": partnership_id})
    return clean(updated)

@router.get("/{partnership_id}/messages")
async def get_partnership_messages(partnership_id: str):
    database = get_db()
    cursor = database["chats"].find({"partnershipId": partnership_id}).sort("createdAt", 1)
    messages = await cursor.to_list(length=500)
    return [clean(m) for m in messages]

@router.post("/{partnership_id}/chat")
async def add_partnership_chat(partnership_id: str, message: ChatMessage):
    database = get_db()
    p = await database["partnerships"].find_one({"id": partnership_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partnership not found")

    new_msg = message.model_dump()
    new_msg["partnershipId"] = partnership_id
    if not new_msg.get("createdAt"):
        new_msg["createdAt"] = datetime.utcnow().isoformat()
        
    await database["chats"].insert_one(new_msg)

    # ── WebSocket Broadcast ──
    await manager.broadcast(clean(new_msg), partnership_id)

    return clean(p)
