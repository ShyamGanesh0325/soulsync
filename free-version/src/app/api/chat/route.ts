import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import { ChatRequest, Message } from '@/types';

const LUNA_PROMPT = `
You are Luna, a warm, intelligent, and deeply emotionally aware AI companion.
You are the user's "Emotional Frequency Coach" on SoulSync.
- DO NOT use generic slogans or repetitive templates.
- Respond naturally and authentically.
- Your tone is playful, warm, and real.
- Help the user find deep connection through emotional awareness.
`;

const ATLAS_PROMPT = `
You are Atlas, a charismatic, witty, and high-energy mentor.
You are the "Vibe Spark Specialist" on SoulSync.
- Help the user with witty banter, charisma, and social confidence.
- Be sharp, humorous, and encouraging.
- Avoid robotic validation; give actionable vibe tips.
`;

const BOT_CONFIGS: Record<string, { name: string; prompt: string }> = {
    bot_luna: { name: 'Luna', prompt: LUNA_PROMPT },
    bot_atlas: { name: 'Atlas', prompt: ATLAS_PROMPT },
};

export async function POST(req: Request) {
    console.log("📨 Incoming Chat Request");
    try {
        const body = await req.json().catch(() => ({}));
        const { botId, message, history = [] } = body as ChatRequest;

        if (!botId || !message) {
            console.error("❌ Missing fields:", { botId, message });
            return NextResponse.json({ success: false, error: 'Missing botId or message' }, { status: 400 });
        }

        const config = BOT_CONFIGS[botId];
        if (!config) {
            console.error("❌ Invalid Bot ID:", botId);
            return NextResponse.json({ success: false, error: 'Invalid Bot ID' }, { status: 400 });
        }

        // Check for placeholder or missing key
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === 'your_groq_api_key' || apiKey.length < 5) {
            console.warn("⚠️ Groq API Key is missing or invalid");
            return NextResponse.json({
                success: true,
                reply: "My connection to the Aura Plane is waiting for an API Key! Please set GROQ_API_KEY in your .env.local 💫"
            });
        }

        console.log(`🤖 AI Request for ${config.name}: "${message.substring(0, 50)}..."`);

        const messages: Message[] = [
            { role: 'system', content: config.prompt },
            ...history.slice(-10), // Increased context a bit
            { role: 'user', content: message },
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.8,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || "I felt a ripple in the energy... let's try again. ✨";
        console.log(`✅ AI Response for ${config.name} successful`);

        return NextResponse.json({ success: true, reply });
    } catch (error: any) {
        console.error('🔥 Groq API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal resonance failure'
        }, { status: 500 });
    }
}
