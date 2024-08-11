import json
import ytmusicapi, yt_dlp
import multiprocessing
from fastapi import APIRouter, WebSocket

# Create the app
router = APIRouter(prefix="/song")
ytm = ytmusicapi.YTMusic()

ws_connections = {}

# Search songs
async def search(query: str):
    """Search for a song"""
    query = query.lower()
    results = []
    search_results = ytm.search(query, filter="songs", limit=50)
    for result in search_results:
        cover = ""
        try:
            cover = result['thumbnails'][1]['url']
        except IndexError:
            cover = result['thumbnails'][0]['url']
        results.append({
            "title": result['title'],
            "artist": ((result['artists'][0]['name'].split(",")[0]) if "," in result['artists'][0]['name'] else (result['artists'][0]['name'])) if result['artists'] else "Unknown",
            "cover": cover,
            "id": result['videoId'],
            "duration": result['duration']
        })
    return results

# Get song info
def get_song_info(id):
    info = ytm.get_song(id)
    min, sec = divmod(int(info['videoDetails']['lengthSeconds']), 60)
    cover = ""
    try:
        cover = info['videoDetails']['thumbnail']['thumbnails'][1]['url']
    except IndexError:
        cover = info['videoDetails']['thumbnail']['thumbnails'][0]['url']
    return {
        info['videoDetails']['videoId']: {
            "title": info['videoDetails']['title'],
            "artist": info['videoDetails']['author'].split(",")[0] if "," in info['videoDetails']['author'] else info['videoDetails']['author'],
            "cover": cover,
            "id": info['videoDetails']['videoId'],
            "duration": f"{min:02d}:{sec:02d}"
        }
    }

async def info(id: str):
    """Get the song's info"""
    ids = id.split(",") if "," in id else [id]
    with multiprocessing.Pool() as pool:
        results = pool.map(get_song_info, ids)
        pool.close()
        pool.join()
    merged_results = {}
    for result in results:
        merged_results.update(result)
    return merged_results

# Stream song
async def stream(id: str):
    """Get the song"""
    video_url = "https://www.youtube.com/watch?v=" + id
    try:
        with yt_dlp.YoutubeDL({"format": "ba*", "skip_download": True}) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            audio = info_dict['url']
        return {
            id: audio
        }
    except:
        return {id: "NONE"}

# Lyrics
async def lyrics(id: str):
    """Get the song's lyrics"""
    lyrics_id = ytm.get_watch_playlist(id)['lyrics']
    if lyrics_id:
        lyrics = ytm.get_lyrics(lyrics_id)
        return {
            id: lyrics['lyrics'].replace("\n", "<br>")
        }
    else:
        return {id: "NONE"}

# Send message
async def send_msg(user_id: int, dict: dict):
    """Send a message to the user"""
    if user_id in ws_connections:
        await ws_connections[user_id].send_json(dict)

# Websocket
@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket, user_id: int):
    """Websocket for song"""
    await ws.accept()
    ws_connections[user_id] = ws
    try:
        while True:
            data = await ws.receive_text()
            data = json.loads(data)
            if data['type'] == "close":
                if user_id in ws_connections:
                    del ws_connections[user_id]
                await ws.close()
                break
            elif data['type'] == "base":
                await send_msg(
                    user_id,
                    {
                        "type": "base",
                        "home": await search("Global top songs"),
                        "trending": await search("Global trending songs")
                    }
                )
            elif data['type'] == "search":
                await send_msg(
                    user_id,
                    {
                        "type": "search",
                        "results": await search(data['query'])
                    }
                )
            elif data['type'] == "info":
                await send_msg(
                    user_id,
                    {
                        "type": "info",
                        "results": await info(data['id'])
                    }
                )
            elif data['type'] == "lyrics":
                await send_msg(
                    user_id,
                    {
                        "type": "lyrics",
                        "results": await lyrics(data['id'])
                    }
                )
            elif data['type'] == "stream":
                await send_msg(
                    user_id,
                    {
                        "type": "stream",
                        "results": await stream(data['id'])
                    }
                )
    except:
        if user_id in ws_connections:
            del ws_connections[user_id]
