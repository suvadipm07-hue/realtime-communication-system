from fastapi import APIRouter, WebSocket, WebSocketDisconnect


# ==========================================
# WEBSOCKET ROUTER
# ==========================================

websocket_router = APIRouter()


# ==========================================
# CONNECTION MANAGER
# ==========================================

class ConnectionManager:

    def __init__(self):

        # Stores active connections
        # Structure:
        #
        # {
        #     "chat_id": [
        #         websocket1,
        #         websocket2
        #     ]
        # }

        self.active_connections = {}


    # ======================================
    # CONNECT USER
    # ======================================

    async def connect(
        self,
        chat_id: str,
        websocket: WebSocket
    ):

        # Accept WebSocket connection
        await websocket.accept()


        # Create chat list if it does not exist

        if chat_id not in self.active_connections:

            self.active_connections[chat_id] = []


        # Add user connection

        self.active_connections[chat_id].append(
            websocket
        )


        print(
            f"WebSocket connected to chat: {chat_id}"
        )


    # ======================================
    # DISCONNECT USER
    # ======================================

    def disconnect(
        self,
        chat_id: str,
        websocket: WebSocket
    ):

        if chat_id in self.active_connections:

            if websocket in self.active_connections[chat_id]:

                self.active_connections[chat_id].remove(
                    websocket
                )


            # Remove empty chat

            if len(
                self.active_connections[chat_id]
            ) == 0:

                del self.active_connections[chat_id]


        print(
            f"WebSocket disconnected from chat: {chat_id}"
        )


    # ======================================
    # BROADCAST MESSAGE
    # ======================================

    async def broadcast(
        self,
        chat_id: str,
        message_data: dict
    ):

        # Check if anyone is connected

        if chat_id not in self.active_connections:

            return


        disconnected_connections = []


        # Send message to everyone
        # connected to this chat

        for websocket in self.active_connections[chat_id]:

            try:

                await websocket.send_json(
                    message_data
                )

            except:

                disconnected_connections.append(
                    websocket
                )


        # Remove disconnected users

        for websocket in disconnected_connections:

            self.disconnect(
                chat_id,
                websocket
            )


# ==========================================
# CREATE MANAGER
# ==========================================

manager = ConnectionManager()


# ==========================================
# WEBSOCKET ENDPOINT
# ==========================================

@websocket_router.websocket(
    "/ws/messages/{chat_id}"
)
async def websocket_messages(
    websocket: WebSocket,
    chat_id: str
):

    # Connect user

    await manager.connect(
        chat_id,
        websocket
    )


    try:

        # Keep connection alive

        while True:

            await websocket.receive_text()


    except WebSocketDisconnect:

        # Remove disconnected user

        manager.disconnect(
            chat_id,
            websocket
        )