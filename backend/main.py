"""
Root entry point for ImpactBridge API.
Proxies to the modular app in app/main.py
"""
import sys
import os

# Ensure the backend directory is in the path so 'app' can be found
sys.path.append(os.path.dirname(__file__))

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
