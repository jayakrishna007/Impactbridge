# ImpactBridge

A CSR (Corporate Social Responsibility) platform connecting funders, NGOs, and beneficiaries.

## Project Structure

```
impactbridge/
│
├── frontend/               # Next.js frontend application
│   ├── package.json
│   ├── next.config.mjs
│   ├── app/                # Next.js app router pages
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility libraries and contexts
│   └── hooks/              # Custom React hooks
│
├── backend/                # FastAPI Python backend
│   ├── main.py             # Main API entry point
│   ├── database.py         # Database connection & models
│   ├── requirements.txt    # Python dependencies
│   └── test_db.py          # Database connection tests
│
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
