export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatRequest {
    botId: 'bot_luna' | 'bot_atlas';
    message: string;
    history?: Message[];
}

export interface ChatResponse {
    reply: string;
    success: boolean;
    error?: string;
}
