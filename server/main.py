import json
from fastapi import FastAPI
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routers import auth, db, song

# Config file
with open("../config.json", "r") as f:
    config = json.load(f)

# Create the app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=config['client'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.add_middleware(SessionMiddleware, secret_key=config['discord']['client_secret'])

# App routes
app.include_router(auth.router) # Authorization
app.include_router(db.router) # Database
app.include_router(song.router) # Song

# Check the server status
@app.get("/")
async def main():
    """Check the server status"""
    return Response(status_code=200, content="OK")
