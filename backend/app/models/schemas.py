from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

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

class MouSignRequest(BaseModel):
    role: str # 'funder' or 'partner'

class NotificationCreate(BaseModel):
    recipientEmail: str
    senderName:     str
    type:           str
    title:          str
    message:        str
    linkHref:       Optional[str] = None
    linkLabel:      Optional[str] = None

class ChatMessage(BaseModel):
    partnershipId: Optional[str] = None
    sender: str  # 'funder' or 'partner'
    name: str
    initials: str
    text: str
    time: str
    createdAt: Optional[str] = None
