import uuid
from datetime import datetime

def clean(doc: dict) -> dict:
    if doc:
        doc.pop("_id", None)
    return doc

async def push_notification(database, *, recipientEmail: str, senderName: str,
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
