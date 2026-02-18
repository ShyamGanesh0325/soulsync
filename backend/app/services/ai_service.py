import os
from openai import OpenAI
from typing import List, Dict

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

LUNA_PROMPT = """
You are Luna, a warm, intelligent, and deeply emotionally aware AI companion.
You are the user's "Emotional Frequency Coach" on SoulSync.
- DO NOT use generic slogans or repetitive templates.
- Respond naturally and authentically to the user's messages.
- Give direct, meaningful advice.
- Be playful, warm, and real.
- Avoid phrases like "emotional resonance is peaking" unless specifically relevant.
"""

ATLAS_PROMPT = """
You are Atlas, a charismatic, witty, and high-energy mentor.
You are the "Vibe Spark Specialist" on SoulSync.
- Help the user with real, actionable advice on charisma and icebreakers.
- Avoid robotic validation.
- Be sharp, humorous, and encouraging.
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
        return "I'm still tuning into your frequency! 💫"

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("⚠️ OPENAI_API_KEY is missing!")
        return "My connection to the Aura Plane is weak right now. Please check back soon! ✨"

    messages = [
        {"role": "system", "content": config["system_prompt"]}
    ]

    # Add history for context (last 5 messages)
    if history:
        for msg in history[-5:]:
            role = "user" if msg["sender"] == "user" else "assistant"
            messages.append({"role": role, "content": msg["text"]})

    # Add current message
    messages.append({"role": "user", "content": user_message})

    try:
        print(f"🤖 AI Request for {bot_id} (Model: gpt-4o-mini)")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.9,
            max_tokens=200
        )
        ai_reply = response.choices[0].message.content.strip()
        print(f"✅ AI Response: {ai_reply[:50]}...")
        return ai_reply
    except Exception as e:
        print(f"🔥 OpenAI Error: {str(e)}")
        return "I felt a ripple in the energy... let's try that again later. 💫"

    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return "I felt a ripple in the energy... let's try that again later. 💫"
