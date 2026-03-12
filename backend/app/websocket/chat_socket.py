from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # Room-based connections: { partnership_id: [WebSocket, ...] }
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, partnership_id: str):
        await websocket.accept()
        if partnership_id not in self.active_connections:
            self.active_connections[partnership_id] = []
        self.active_connections[partnership_id].append(websocket)
        print(f"🔌 WebSocket connected to room: {partnership_id}")

    def disconnect(self, websocket: WebSocket, partnership_id: str):
        if partnership_id in self.active_connections:
            self.active_connections[partnership_id].remove(websocket)
            if not self.active_connections[partnership_id]:
                del self.active_connections[partnership_id]
        print(f"🔌 WebSocket disconnected from room: {partnership_id}")

    async def broadcast(self, message: dict, partnership_id: str):
        """Send a message to all connected clients in a specific partnership room."""
        if partnership_id in self.active_connections:
            # We send as JSON string
            message_json = json.dumps(message)
            for connection in self.active_connections[partnership_id]:
                try:
                    await connection.send_text(message_json)
                except Exception as e:
                    print(f"❌ Failed to send WebSocket message: {e}")
                    # Could potentially remove broken connection here

manager = ConnectionManager()
