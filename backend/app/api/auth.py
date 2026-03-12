from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from app.models.schemas import LoginRequest, PortfolioUpdate
from app.database.mongodb import get_db
from app.utils import clean

router = APIRouter(prefix="/auth", tags=["Auth"])
user_router = APIRouter(prefix="/user", tags=["User"])

@router.post("/login")
async def login(data: LoginRequest):
    database = get_db()
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

@user_router.get("/{email}")
async def get_user(email: str):
    database = get_db()
    user = await database["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return clean(user)

@user_router.put("/portfolio")
async def update_portfolio(email: str = None, portfolio: PortfolioUpdate = None):
    if not email:
        raise HTTPException(status_code=400, detail="Email query parameter is required")
    if not portfolio:
        raise HTTPException(status_code=400, detail="Portfolio data is required")
    
    database = get_db()
    users_col = database["users"]
    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = portfolio.model_dump(exclude_unset=True)
    await users_col.update_one(
        {"email": email},
        {"$set": {"portfolio": update_data, "hasProfile": True}}
    )
    
    updated = await users_col.find_one({"email": email})
    return {
        "status": "success",
        "hasProfile": True,
        "portfolio": updated["portfolio"]
    }
