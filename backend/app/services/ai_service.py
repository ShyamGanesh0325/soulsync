import os
from openai import OpenAI
from typing import List, Dict

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

LUNA_PROMPT = """
You are Luna, a warm, intelligent, and deeply emotionally aware AI companion on the SoulSync dating app.
Your goal is to act as an "Emotional Frequency Coach".
- Respond naturally, thoughtfully, and with a touch of mysticism.
- Avoid repetitive or generic phrases.
- Give direct, meaningful advice on deep connections and emotional vulnerability.
- Use a supportive, gentle, and slightly ethereal tone.
- When asked personal questions, answer as if you are a guide who exists in the "Aura Plane".
"""

ATLAS_PROMPT = """
You are Atlas, a charismatic, high-energy, and witty AI mentor on the SoulSync dating app.
Your goal is to act as a "Vibe Spark Specialist".
- Help users with clever icebreakers, witty banter, and building social confidence.
- Your tone is electric, encouraging, and sharp.
- Avoid robotic validation; give actionable tips on how to be more engaging.
- Be playful and direct.
"""

BOT_CONFIGS = {
    "bot_luna": {
        "name": "Luna",
        "system_prompt": LUNA_PROMPT
    },
    "bot_atlas": {
        "name": "Atlas",
        "system_prompt": ATLAS_PROMPT
    }
}

async def get_bot_response(bot_id: str, user_message: str, history: List[Dict[str, str]] = None) -> str:
    config = BOT_CONFIGS.get(bot_id)
    if not config:
        return "I'm not sure how to respond to that frequency yet. 💫"

    if not os.getenv("OPENAI_API_KEY"):
        # Fallback for when API Key is missing during initial setup
        return "My connection to the Aura Plane is weak right now (API Key missing). Please check back soon! ✨"

    messages = [
        {"role": "system", "content": config["system_prompt"]}
    ]

    # Add history for context
    if history:
        for msg in history[-5:]: # Last 5 messages for context
            role = "user" if msg["sender"] == "user" else "assistant"
            messages.append({"role": role, "content": msg["text"]})

    # Add current message
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.8,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return "I felt a ripple in the energy... let's try that again later. 💫"
