import os
import json
import requests
from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse

# Config file
with open("../config.json", "r") as f:
    config = json.load(f)

# Config the app
router = APIRouter(prefix="/auth")

# Discord OAuth2
DISCORD_API = "https://discord.com/api/v10"

# Fetch user data
async def get_discord_user(access_token: str):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(f"{DISCORD_API}/users/@me", headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        return {
            "id": user_data['id'],
            "name": user_data['username'],
            "avatar": f"https://cdn.discordapp.com/avatars/{user_data['id']}/{user_data['avatar']}.png" if user_data["avatar"] else "https://cdn.discordapp.com/embed/avatars/1.png"
        }
    else:
        return None

# Exchange code for token
async def exchange_code_for_token(code: str):
    token_url = f"{DISCORD_API}/oauth2/token"
    token_data = {
        "client_id": config['discord']['client_id'],
        "client_secret": config['discord']['client_secret'],
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": config['server'] + "/auth/callback",
        "scope": "identify"
    }
    response = requests.post(token_url, data=token_data)
    if response.status_code == 200:
        token_info = response.json()
        return token_info.get("access_token")
    else:
        return None


# Login
@router.get("/login")
async def login():
    """Login via discord"""
    return RedirectResponse(
        f"{DISCORD_API}/oauth2/authorize" +
        f"?client_id={config['discord']['client_id']}" +
        f"&redirect_uri={config['server']}/auth/callback" +
        f"&response_type=code" +
        f"&scope=identify"
    )

# Callback
@router.get("/callback")
async def callback(request: Request, code: str):
    """Callback for discord login"""
    access_token = await exchange_code_for_token(code)
    if access_token:
        data = await get_discord_user(access_token)
        request.session["user"] = data
        if request.session.get("user"):
            return RedirectResponse(config['client'])
        else:
            return RedirectResponse("/auth/login")
    else:
        return RedirectResponse("/auth/login")

# Logout
@router.get("/logout")
async def logout(request: Request):
    """Logout from session"""
    request.session.pop("user", None)
    return RedirectResponse(config['client'])

# Delete
@router.get("/delete")
async def delete(request: Request):
    """Delete user"""
    user = request.session.get("user")
    if user:
        file_path = f"./database/{user['id']}.json"
        if os.path.exists(file_path):
            os.remove(file_path)
        request.session.pop("user", None)
    return RedirectResponse(config['client'])

# Get user
@router.get("/user")
async def get_user(request: Request):
    """Get user data"""
    data = request.session.get("user")
    if data:
        return data
    else:
        return Response(status_code=404, content="User not found")