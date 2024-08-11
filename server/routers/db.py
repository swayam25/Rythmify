import os
import json
from fastapi import APIRouter, WebSocket

# Create the app
router = APIRouter(prefix="/db")
ws_connections = {}

# Database
db = "../database"

# Add History
async def add_history(user_id: int, song_id: str):
    """Add a song to the history"""
    if not os.path.exists(db):
        os.mkdir(db)
    file_path = f"{db}/{user_id}.json"
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            data = {"history": [song_id], "playlist": {}}
            json.dump(data, file, indent=4)
    else:
        with open(file_path, "r") as file:
            data = json.load(file)
            if song_id in data['history']:
                data['history'].remove(song_id)
            data['history'].append(song_id)
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
    return song_id

# Remove History
async def remove_history(user_id: int, song_id: str):
    """Remove a song from the history"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            if song_id in data['history']:
                data['history'].remove(song_id)
                with open(file_path, "w") as file:
                    json.dump(data, file, indent=4)
                return song_id
            else:
                return "NONE"
    return "NONE"

# Clear History
async def clear_history(user_id: int):
    """Clear the user's history"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
        with open(file_path, "w") as file:
            data['history'] = []
            json.dump(data, file, indent=4)
        return data
    return "NONE"

# Create Playlist
async def create_playlist(user_id: int, playlist_name: str):
    """Create a playlist"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            if playlist_name in data['playlist']:
                return "EXISTS"
            else:
                data['playlist'][playlist_name] = []
                with open(file_path, "w") as file:
                    json.dump(data, file, indent=4)
                return playlist_name
    return "NONE"

# Rename Playlist
async def rename_playlist(user_id: int, playlist_name: str, new_name: str):
    """Rename the playlist"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            if playlist_name in data['playlist']:
                data['playlist'][new_name] = data['playlist'][playlist_name]
                del data['playlist'][playlist_name]
                with open(file_path, "w") as file:
                    json.dump(data, file, indent=4)
                return {
                    "name": playlist_name,
                    "new_name": new_name
                }
            else:
                return "NONE"
    return "NONE"

# Add Playlist
async def add_playlist(user_id: int, playlist_name: str, song_id: str):
    """Add a song to the playlist"""
    if not os.path.exists(db):
        os.mkdir(db)
    file_path = f"{db}/{user_id}.json"
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            data = {"history": [], "playlist": {playlist_name: [song_id]}}
            json.dump(data, file, indent=4)
    else:
        with open(file_path, "r") as file:
            data = json.load(file)
            if playlist_name in data['playlist']:
                if song_id in data['playlist'][playlist_name]:
                    data['playlist'][playlist_name].remove(song_id)
                data['playlist'][playlist_name].append(song_id)
            else:
                return "NONE"
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
    return {
        "name": playlist_name,
        "id": song_id
    }

# Remove Playlist
async def remove_playlist(user_id: int, playlist_name: str, song_id: str):
    """Remove a song from the playlist"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            if playlist_name in data['playlist']:
                if song_id in data['playlist'][playlist_name]:
                    data['playlist'][playlist_name].remove(song_id)
                    with open(file_path, "w") as file:
                        json.dump(data, file, indent=4)
                    return {
                        "name": playlist_name,
                        "id": song_id
                    }
                else:
                    return "NONE"
            else:
                return "NONE"
    return "NONE"

# Delete Playlist
async def delete_playlist(user_id: int, playlist_name: str):
    """Delete the playlist"""
    file_path = f"{db}/{user_id}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            if playlist_name in data['playlist']:
                del data['playlist'][playlist_name]
                with open(file_path, "w") as file:
                    json.dump(data, file, indent=4)
                return playlist_name
            else:
                return "NONE"
    return "NONE"

# Send msg to user websocket
async def send_msg(user_id: int, data: dict):
    """Send msg the user's websocket"""
    if user_id in ws_connections:
        await ws_connections[user_id].send_json(data)

# User data websocket
@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket, user_id: int):
    """Get the user's data via WebSocket"""
    if not os.path.exists(db):
        os.mkdir(db)
    file_path = f"{db}/{user_id}.json"
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            data = {"history": [], "playlist": {}}
            json.dump(data, file, indent=4)
    else:
        with open(file_path, "r") as file:
            data = json.load(file)
    await ws.accept()
    ws_connections[user_id] = ws
    try:
        while True:
            _data = await ws.receive_text()
            _data = json.loads(_data)
            if _data['type'] == "close":
                if user_id in ws_connections:
                    del ws_connections[user_id]
                await ws.close()
                break
            elif _data['type'] == "get":
                await send_msg(
                    user_id,
                    {
                        "type": "get",
                        "results": data
                    }
                )
            elif _data['type'] == "add_history":
                await send_msg(
                    user_id,
                    {
                        "type": "add_history",
                        "results": await add_history(user_id, _data['id'])
                    }
                )
            elif _data['type'] == "remove_history":
                await send_msg(
                    user_id,
                    {
                        "type": "remove_history",
                        "results": await remove_history(user_id, _data['id'])
                    }
                )
            elif _data['type'] == "clear_history":
                await send_msg(
                    user_id,
                    {
                        "type": "clear_history",
                        "results": await clear_history(user_id)
                    }
                )
            elif _data['type'] == "create_playlist":
                await send_msg(
                    user_id,
                    {
                        "type": "create_playlist",
                        "results": await create_playlist(user_id, _data['name'])
                    }
                )
            elif _data['type'] == "rename_playlist":
                await send_msg(
                    user_id,
                    {
                        "type": "rename_playlist",
                        "results": await rename_playlist(user_id, _data['name'], _data['new_name'])
                    }
                )
            elif _data['type'] == "add_playlist":
                await send_msg(
                    user_id,
                    {
                        "type": "add_playlist",
                        "results": await add_playlist(user_id, _data['name'], _data['id'])
                    }
                )
            elif _data['type'] == "remove_playlist":
                await send_msg(
                    user_id,
                    {
                        "type": "remove_playlist",
                        "results": await remove_playlist(user_id, _data['name'], _data['id'])
                    }
                )
            elif _data['type'] == "delete_playlist":
                await send_msg(
                    user_id,
                    {
                        "type": "delete_playlist",
                        "results": await delete_playlist(user_id, _data['name'])
                    }
                )

    except:
        user = ws_connections[user_id]
        if user:
            del user