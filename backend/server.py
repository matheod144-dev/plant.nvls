from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
import asyncio

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Telegram
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "8641085735:AAHYpbZEWkHmJ75uc4IIMv1BR30hBHVT7HM")
TELEGRAM_ORDER_CHAT_ID = os.environ.get("TELEGRAM_ORDER_CHAT_ID", "")  # À configurer
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

# URL du catalogue (à mettre à jour avec votre URL)
CATALOGUE_URL = os.environ.get("CATALOGUE_URL", "https://traduire-systeme.preview.emergentagent.com/catalogue")
CONTACT_LINK = "https://t.me/+A0IQGf2DjC1kNDZk"

# Models
class CartItem(BaseModel):
    productId: int
    name: str
    qty: str
    price: int
    grams: int
    quantity: int

class OrderRequest(BaseModel):
    prenom: str
    heure: str
    cart: List[CartItem]
    total: int
    message: str

# Endpoints
@app.get("/api/")
async def root():
    return {"message": "plant.nvls API"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.post("/api/send-order")
async def send_order(order: OrderRequest):
    """Envoie la commande sur le canal Telegram des commandes"""
    try:
        # Construire le message formaté
        message = f"🌿 *NOUVELLE COMMANDE*\n\n"
        message += f"👤 *Client:* {order.prenom}\n"
        message += f"🕐 *Heure souhaitée:* {order.heure}\n\n"
        message += f"📦 *Articles:*\n"
        
        for item in order.cart:
            message += f"  • {item.name} ({item.qty}) x{item.quantity} = {item.price * item.quantity}€\n"
        
        message += f"\n💰 *TOTAL: {order.total}€*"

        # Envoyer via le bot Telegram au canal des commandes
        # On utilise le lien du groupe pour obtenir le chat_id
        # Pour l'instant, on envoie directement si le chat_id est configuré
        if TELEGRAM_ORDER_CHAT_ID:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{TELEGRAM_API}/sendMessage",
                    json={
                        "chat_id": TELEGRAM_ORDER_CHAT_ID,
                        "text": message,
                        "parse_mode": "Markdown"
                    }
                )
                if response.status_code == 200:
                    return {"success": True, "message": "Commande envoyée"}
                else:
                    raise HTTPException(status_code=500, detail="Erreur Telegram")
        else:
            # Pas de chat_id configuré, le frontend utilisera le fallback
            return {"success": False, "message": "Chat ID non configuré"}
            
    except Exception as e:
        print(f"Erreur envoi commande: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ====== BOT TELEGRAM ======

async def send_telegram_message(chat_id: int, text: str, reply_markup: dict = None):
    """Envoie un message Telegram avec boutons optionnels"""
    async with httpx.AsyncClient() as client:
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "Markdown"
        }
        if reply_markup:
            payload["reply_markup"] = reply_markup
        
        await client.post(f"{TELEGRAM_API}/sendMessage", json=payload)

async def send_telegram_photo(chat_id: int, photo_url: str, caption: str, reply_markup: dict = None):
    """Envoie une photo avec caption et boutons"""
    async with httpx.AsyncClient() as client:
        payload = {
            "chat_id": chat_id,
            "photo": photo_url,
            "caption": caption,
            "parse_mode": "Markdown"
        }
        if reply_markup:
            payload["reply_markup"] = reply_markup
        
        await client.post(f"{TELEGRAM_API}/sendPhoto", json=payload)

def get_main_menu_keyboard():
    """Retourne le clavier avec les boutons principaux"""
    return {
        "inline_keyboard": [
            [{"text": "📞 Contact", "url": CONTACT_LINK}],
            [{"text": "🛒 Catalogue", "web_app": {"url": CATALOGUE_URL}}],
            [{"text": "🔗 Nos Liens", "url": CONTACT_LINK}]
        ]
    }

@app.post("/api/telegram/webhook")
async def telegram_webhook(update: dict):
    """Webhook pour recevoir les messages du bot Telegram"""
    try:
        if "message" in update:
            message = update["message"]
            chat_id = message["chat"]["id"]
            text = message.get("text", "")
            
            if text == "/start":
                # Message de bienvenue avec image et boutons
                welcome_text = (
                    "🌿 *plant.nvls Bot* 🌿\n\n"
                    "Bienvenue chez plant.nvls !\n"
                    "Découvrez notre sélection premium.\n\n"
                    "Utilisez les boutons ci-dessous pour naviguer 👇"
                )
                
                # Envoyer le message avec les boutons
                await send_telegram_message(
                    chat_id, 
                    welcome_text, 
                    get_main_menu_keyboard()
                )
                
            elif text == "/menu":
                await send_telegram_message(
                    chat_id,
                    "🌿 *Menu Principal*\n\nChoisissez une option:",
                    get_main_menu_keyboard()
                )
                
        return {"ok": True}
    except Exception as e:
        print(f"Webhook error: {e}")
        return {"ok": False, "error": str(e)}

@app.get("/api/telegram/setup")
async def setup_telegram_webhook():
    """Configure le webhook Telegram (à appeler une fois)"""
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', 'https://traduire-systeme.preview.emergentagent.com')}/api/telegram/webhook"
    
    async with httpx.AsyncClient() as client:
        # Supprimer l'ancien webhook
        await client.post(f"{TELEGRAM_API}/deleteWebhook")
        
        # Configurer le nouveau webhook
        response = await client.post(
            f"{TELEGRAM_API}/setWebhook",
            json={"url": webhook_url}
        )
        
        return response.json()

@app.get("/api/telegram/info")
async def get_bot_info():
    """Obtient les informations du bot"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TELEGRAM_API}/getMe")
        return response.json()

@app.get("/api/telegram/updates")
async def get_updates():
    """Récupère les dernières mises à jour pour trouver le chat_id"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TELEGRAM_API}/getUpdates")
        return response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
