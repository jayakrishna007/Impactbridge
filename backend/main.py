"""
ImpactBridge – FastAPI Backend
Database: MongoDB (via Motor async driver)

Endpoints:
  Auth & Users:
    POST   /auth/login
    GET    /user/{email}
    PUT    /user/portfolio

  Proposals:
    GET/POST  /proposals/ngo
    GET       /proposals/ngo/by-user/{email}
    GET       /proposals/ngo/{id}
    GET/POST  /proposals/individual
    GET       /proposals/individual/by-user/{email}
    GET       /proposals/individual/{id}
    GET       /projects/csr

  Partnerships:
    POST   /partnerships                        – Create (idempotent) + notify partner
    PUT    /partnerships/{id}/funder-confirm    – Funder confirms + notify partner
    PUT    /partnerships/{id}/partner-confirm   – Partner accepts + notify funder
    GET    /partnerships/{type}/{proposal_id}   – Get for funder+proposal
    GET    /partnerships/for-user/{email}       – All partnerships for a user

  Notifications:
    POST   /notifications                       – Create manually
    GET    /notifications/{email}               – List all for user
    GET    /notifications/{email}/unread-count  – Badge count
    PUT    /notifications/{id}/read             – Mark one read
    PUT    /notifications/mark-all-read/{email} – Mark all read

  Other:
    GET    /health
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
import os

import database as db

# ── Lifespan (replaces deprecated @app.on_event) ───────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db.connect_db()
    database = db.get_db()
    if await database["csr_projects"].count_documents({}) == 0:
        await seed_csr_projects(database)
    yield
    # Shutdown
    await db.close_db()

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(title="ImpactBridge API", version="3.0.0", lifespan=lifespan)

# ── CORS ───────────────────────────────────────────────────────────────────
# On Render, set ALLOWED_ORIGINS to a comma-separated list of your frontend URLs.
# Example: https://impactbridge.vercel.app,https://impactbridge-git-main.vercel.app
# If not set, defaults to allow localhost for local dev.
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "")

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# Add any extra origins from the env var (comma-separated)
if ALLOWED_ORIGINS_ENV:
    for origin in ALLOWED_ORIGINS_ENV.split(","):
        origin = origin.strip()
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ══════════════════════════════════════════════════════════════════════════
# Pydantic Models
# ══════════════════════════════════════════════════════════════════════════

class LoginRequest(BaseModel):
    name:  str
    email: str
    role:  str


class PortfolioUpdate(BaseModel):
    about:      Optional[str]             = None
    mission:    Optional[str]             = None
    vision:     Optional[str]             = None
    experience: Optional[str]            = None
    contact:    Optional[Dict[str, Any]] = None


class NGOProposalCreate(BaseModel):
    ngoName:         str
    title:           str
    category:        str
    fundingRequired: str
    location:        str
    deadline:        str
    description:     str
    beneficiaries:   int                   = 0
    createdBy:       Optional[str]         = None
    fullDetails:     Optional[Dict[str, Any]] = None


class IndividualProposalCreate(BaseModel):
    name:            str
    title:           str
    category:        str
    fundingRequired: str
    location:        str
    deadline:        str
    description:     str
    beneficiaries:   int                   = 0
    createdBy:       Optional[str]         = None
    fullDetails:     Optional[Dict[str, Any]] = None


class PartnershipCreate(BaseModel):
    proposalId:    str
    proposalType:  str   # "ngo" | "individual"
    proposalTitle: str
    funderEmail:   str
    funderName:    str
    partnerEmail:  str
    partnerName:   str


class NotificationCreate(BaseModel):
    recipientEmail: str
    senderName:     str
    type:           str
    title:          str
    message:        str
    linkHref:       Optional[str] = None
    linkLabel:      Optional[str] = None


# ══════════════════════════════════════════════════════════════════════════
# Helper
# ══════════════════════════════════════════════════════════════════════════

def clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


async def _push_notification(database, *, recipientEmail: str, senderName: str,
                              notif_type: str, title: str, message: str,
                              linkHref: str = None, linkLabel: str = None) -> dict:
    notif = {
        "id":             f"notif-{uuid.uuid4().hex[:10]}",
        "recipientEmail": recipientEmail,
        "senderName":     senderName,
        "type":           notif_type,
        "title":          title,
        "message":        message,
        "linkHref":       linkHref,
        "linkLabel":      linkLabel,
        "isRead":         False,
        "createdAt":      datetime.utcnow().isoformat(),
    }
    await database["notifications"].insert_one(notif)
    return notif


# ══════════════════════════════════════════════════════════════════════════
# Auth
# ══════════════════════════════════════════════════════════════════════════

@app.post("/auth/login")
async def login(data: LoginRequest):
    database  = db.get_db()
    users_col = database["users"]
    user = await users_col.find_one({"email": data.email})
    if user:
        if user["role"] != data.role:
            raise HTTPException(
                status_code=403,
                detail=f"This email is already registered as a '{user['role']}'. Please select '{user['role']}' as your role."
            )
        return clean(user)
    new_user = {
        "id":         str(uuid.uuid4()),
        "name":       data.name,
        "email":      data.email,
        "role":       data.role,
        "hasProfile": False,
        "portfolio":  {},
        "createdAt":  datetime.utcnow().isoformat(),
    }
    await users_col.insert_one(new_user)
    return clean(new_user)


@app.get("/user/{email}")
async def get_user(email: str):
    database = db.get_db()
    user = await database["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return clean(user)


@app.put("/user/portfolio")
async def update_portfolio(email: str, portfolio: PortfolioUpdate):
    database  = db.get_db()
    users_col = database["users"]
    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    current  = user.get("portfolio", {})
    new_data = portfolio.model_dump(exclude_unset=True)
    if "contact" in new_data and "contact" in current:
        current["contact"].update(new_data["contact"])
        new_data["contact"] = current["contact"]
    merged = {**current, **new_data}
    await users_col.update_one(
        {"email": email},
        {"$set": {"portfolio": merged, "hasProfile": True}}
    )
    return {"status": "success", "hasProfile": True, "portfolio": merged}


# ══════════════════════════════════════════════════════════════════════════
# NGO Proposals
# ══════════════════════════════════════════════════════════════════════════

@app.get("/proposals/ngo")
async def list_ngo_proposals():
    database = db.get_db()
    cursor   = database["ngo_proposals"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]


@app.get("/proposals/ngo/by-user/{email}")
async def get_ngo_proposals_by_user(email: str):
    database = db.get_db()
    cursor   = database["ngo_proposals"].find({"createdBy": email}).sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]


@app.get("/proposals/ngo/{proposal_id}")
async def get_ngo_proposal(proposal_id: str):
    database = db.get_db()
    doc = await database["ngo_proposals"].find_one({"id": proposal_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return clean(doc)


@app.post("/proposals/ngo", status_code=201)
async def create_ngo_proposal(data: NGOProposalCreate):
    database = db.get_db()
    proposal = {
        "id":              f"ngo-{uuid.uuid4().hex[:8]}",
        "ngoName":         data.ngoName,
        "title":           data.title,
        "category":        data.category,
        "fundingRequired": data.fundingRequired,
        "fundingRaised":   "0",
        "progress":        0,
        "beneficiaries":   data.beneficiaries,
        "status":          "Seeking Funding",
        "location":        data.location,
        "deadline":        data.deadline,
        "description":     data.description,
        "fullDetails":     data.fullDetails or {},
        "createdBy":       data.createdBy or "",
        "createdAt":       datetime.utcnow().isoformat(),
    }
    await database["ngo_proposals"].insert_one(proposal)
    return clean(proposal)


# ══════════════════════════════════════════════════════════════════════════
# Individual Proposals
# ══════════════════════════════════════════════════════════════════════════

@app.get("/proposals/individual")
async def list_individual_proposals():
    database = db.get_db()
    cursor   = database["individual_proposals"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]


@app.get("/proposals/individual/by-user/{email}")
async def get_individual_proposals_by_user(email: str):
    database = db.get_db()
    cursor   = database["individual_proposals"].find({"createdBy": email}).sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]


@app.get("/proposals/individual/{proposal_id}")
async def get_individual_proposal(proposal_id: str):
    database = db.get_db()
    doc = await database["individual_proposals"].find_one({"id": proposal_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return clean(doc)


@app.post("/proposals/individual", status_code=201)
async def create_individual_proposal(data: IndividualProposalCreate):
    database = db.get_db()
    proposal = {
        "id":              f"ind-{uuid.uuid4().hex[:8]}",
        "name":            data.name,
        "title":           data.title,
        "category":        data.category,
        "fundingRequired": data.fundingRequired,
        "fundingRaised":   "0",
        "progress":        0,
        "beneficiaries":   data.beneficiaries,
        "status":          "Seeking Funding",
        "location":        data.location,
        "deadline":        data.deadline,
        "description":     data.description,
        "fullDetails":     data.fullDetails or {},
        "createdBy":       data.createdBy or "",
        "createdAt":       datetime.utcnow().isoformat(),
    }
    await database["individual_proposals"].insert_one(proposal)
    return clean(proposal)


# ══════════════════════════════════════════════════════════════════════════
# CSR Projects
# ══════════════════════════════════════════════════════════════════════════

@app.get("/projects/csr")
async def list_csr_projects():
    database = db.get_db()
    cursor   = database["csr_projects"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]


# ══════════════════════════════════════════════════════════════════════════
# Partnerships  (notification-aware)
# ══════════════════════════════════════════════════════════════════════════

@app.post("/partnerships", status_code=201)
async def create_or_get_partnership(data: PartnershipCreate):
    """Create partnership (idempotent). Fires notification to proposal creator."""
    database = db.get_db()
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
    }
    await col.insert_one(partnership)

    return clean(partnership)

@app.get("/partnerships/for-user/{email}")
async def get_partnerships_for_user(email: str):
    """All partnerships involving a user (as funder or as partner)."""
    database = db.get_db()
    cursor = database["partnerships"].find({
        "$or": [{"funderEmail": email}, {"partnerEmail": email}]
    }).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@app.put("/partnerships/{partnership_id}/funder-confirm")
async def funder_confirm(partnership_id: str):
    """Funder confirms interest — notifies the partner."""
    database = db.get_db()
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
        await _push_notification(
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


@app.put("/partnerships/{partnership_id}/partner-confirm")
async def partner_confirm(partnership_id: str):
    """Partner accepts — notifies the funder, marks active if both confirmed."""
    database = db.get_db()
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
        await _push_notification(
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


@app.get("/partnerships/{proposal_type}/{proposal_id}")
async def get_partnership_for_proposal(proposal_type: str, proposal_id: str, funder_email: str):
    """Get partnership by proposal + funder. Query param: funder_email"""
    database = db.get_db()
    doc = await database["partnerships"].find_one({
        "proposalId":   proposal_id,
        "proposalType": proposal_type,
        "funderEmail":  funder_email,
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Partnership not found")
    return clean(doc)

# ══════════════════════════════════════════════════════════════════════════
# Notifications
# ══════════════════════════════════════════════════════════════════════════

@app.post("/notifications", status_code=201)
async def create_notification(data: NotificationCreate):
    database = db.get_db()
    notif = await _push_notification(
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


@app.get("/notifications/{email}/unread-count")
async def get_unread_count(email: str):
    """Badge count — must be defined BEFORE the generic /notifications/{email} route."""
    database = db.get_db()
    count = await database["notifications"].count_documents(
        {"recipientEmail": email, "isRead": False}
    )
    return {"count": count}


@app.get("/notifications/{email}")
async def get_notifications(email: str, limit: int = 30):
    """Get all notifications for a user, newest first."""
    database = db.get_db()
    cursor = database["notifications"].find(
        {"recipientEmail": email}
    ).sort("createdAt", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [clean(d) for d in docs]


@app.put("/notifications/mark-all-read/{email}")
async def mark_all_read(email: str):
    """Mark all notifications for a user as read. Defined before /{id}/read to avoid route clash."""
    database = db.get_db()
    await database["notifications"].update_many(
        {"recipientEmail": email, "isRead": False},
        {"$set": {"isRead": True}}
    )
    return {"status": "ok"}


@app.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a single notification as read."""
    database = db.get_db()
    result = await database["notifications"].update_one(
        {"id": notification_id},
        {"$set": {"isRead": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}


# ══════════════════════════════════════════════════════════════════════════
# Health
# ══════════════════════════════════════════════════════════════════════════

@app.get("/health")
async def health():
    return {"status": "ok", "db": "mongodb"}


# ══════════════════════════════════════════════════════════════════════════
# Seed Data
# ══════════════════════════════════════════════════════════════════════════

async def seed_csr_projects(database):
    projects = [
        {"id": "csr-1", "title": "Digital Literacy for Rural Schools",   "category": "Digital Education",  "funder": "Tata Trusts",       "raised": "1.2 Cr", "target": "2 Cr",   "progress": 60, "beneficiaries": 450,  "status": "Active", "location": "Rajasthan",     "deadline": "Mar 30, 2026", "description": "Equipping rural government schools with computer labs and digital literacy training."},
        {"id": "csr-2", "title": "Mobile Library Initiative",            "category": "Literacy",            "funder": "Reliance Foundation","raised": "85 L",  "target": "1.5 Cr", "progress": 57, "beneficiaries": 320,  "status": "Active", "location": "Maharashtra",   "deadline": "Apr 15, 2026", "description": "A bus-turned-library traveling through remote villages providing books to children."},
        {"id": "csr-3", "title": "Smart Classroom Upgrade",              "category": "Infrastructure",      "funder": "Infosys Foundation", "raised": "2.1 Cr", "target": "2.5 Cr", "progress": 84, "beneficiaries": 1200, "status": "Active", "location": "Karnataka",     "deadline": "May 01, 2026", "description": "Transforming traditional classrooms into interactive learning spaces with smart boards."},
        {"id": "csr-4", "title": "Vocational Excellence Center",         "category": "Vocational",          "funder": "Wipro Foundation",   "raised": "60 L",  "target": "1 Cr",   "progress": 60, "beneficiaries": 180,  "status": "Active", "location": "Tamil Nadu",    "deadline": "Jun 15, 2026", "description": "Vocational training in electronics and robotics for high school dropouts."},
        {"id": "csr-5", "title": "Girl Child Scholarship Fund",          "category": "Scholarships",        "funder": "Mahindra Foundation","raised": "60 L",  "target": "1.8 Cr", "progress": 33, "beneficiaries": 520,  "status": "Active", "location": "Uttar Pradesh", "deadline": "Jul 20, 2026", "description": "Financial support for girls from marginalized communities for higher education."},
        {"id": "csr-6", "title": "Govt School Model Makeover",           "category": "Infrastructure",      "funder": "Adani Foundation",   "raised": "1.1 Cr", "target": "3 Cr",   "progress": 37, "beneficiaries": 800,  "status": "Active", "location": "Gujarat",       "deadline": "Aug 30, 2026", "description": "Renovating buildings, sanitation, and playgrounds of 100 government schools."},
        {"id": "csr-7", "title": "Early Childhood Education",            "category": "Primary Education",   "funder": "HDFC Foundation",    "raised": "45 L",  "target": "1.2 Cr", "progress": 38, "beneficiaries": 600,  "status": "Active", "location": "Rajasthan",     "deadline": "Sep 15, 2026", "description": "Strengthening Anganwadis for high-quality pre-primary education and nutrition."},
        {"id": "csr-8", "title": "Teacher Empowerment Program",          "category": "Teacher Training",    "funder": "Google.org",         "raised": "80 L",  "target": "2 Cr",   "progress": 40, "beneficiaries": 350,  "status": "Active", "location": "Maharashtra",   "deadline": "Oct 01, 2026", "description": "Training government teachers in modern pedagogy and digital classroom management."},
    ]
    now = datetime.utcnow().isoformat()
    for p in projects:
        p["createdAt"] = now
    await database["csr_projects"].insert_many(projects)
    print(f"🌱 Seeded {len(projects)} CSR projects.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
