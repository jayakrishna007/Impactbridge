from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from app.models.schemas import NGOProposalCreate, IndividualProposalCreate
from app.database.mongodb import get_db
from app.utils import clean

router = APIRouter(prefix="/proposals", tags=["Proposals"])
csr_router = APIRouter(prefix="/projects", tags=["CSR Projects"])

# ── NGO Proposals ──
@router.get("/ngo")
async def list_ngo_proposals():
    database = get_db()
    cursor   = database["ngo_proposals"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@router.get("/ngo/by-user/{email}")
async def get_ngo_proposals_by_user(email: str):
    database = get_db()
    cursor   = database["ngo_proposals"].find({"createdBy": email}).sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@router.get("/ngo/{proposal_id}")
async def get_ngo_proposal(proposal_id: str):
    database = get_db()
    doc = await database["ngo_proposals"].find_one({"id": proposal_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return clean(doc)

@router.post("/ngo", status_code=201)
async def create_ngo_proposal(data: NGOProposalCreate):
    database = get_db()
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

# ── Individual Proposals ──
@router.get("/individual")
async def list_individual_proposals():
    database = get_db()
    cursor   = database["individual_proposals"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@router.get("/individual/by-user/{email}")
async def get_individual_proposals_by_user(email: str):
    database = get_db()
    cursor   = database["individual_proposals"].find({"createdBy": email}).sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]

@router.get("/individual/{proposal_id}")
async def get_individual_proposal(proposal_id: str):
    database = get_db()
    doc = await database["individual_proposals"].find_one({"id": proposal_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return clean(doc)

@router.post("/individual", status_code=201)
async def create_individual_proposal(data: IndividualProposalCreate):
    database = get_db()
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

# ── CSR Projects ──
@csr_router.get("/csr")
async def list_csr_projects():
    database = get_db()
    cursor   = database["csr_projects"].find().sort("createdAt", -1)
    docs     = await cursor.to_list(length=200)
    return [clean(d) for d in docs]
