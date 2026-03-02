'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, ArrowLeft, Sparkles } from 'lucide-react';
import { Message } from '@/types';
import api from '@/lib/api';

interface ChatWindowProps {
    botId: 'bot_luna' | 'bot_atlas';
    botName: string;
    onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ botId, botName, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Fetch History on Mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/chat/${botId}`);
                if (response.data.messages) {
                    const formatted: Message[] = response.data.messages.map((m: any) => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    }));

                    if (formatted.length === 0) {
                        setMessages([{
                            role: 'assistant',
                            content: `Hello! I'm ${botName}, your SoulSync AI mentor. How's your energy today? ✨`
                        }]);
                    } else {
                        setMessages(formatted);
                    }
                }
            } catch (err) {
                console.error("History failure:", err);
                setMessages([{
                    role: 'assistant',
                    content: `Hello! I'm ${botName}. My connection to your past chats is a bit blurry, but I'm here now! ✨`
                }]);
            }
        };
        fetchHistory();
    }, [botId, botName]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isTyping) return;

        const userMsg: Message = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await api.post('/chat/send', {
                match_id: botId,
                text: inputText,
                sender: 'user'
            });

            if (response.data.success) {
                // The backend handles the AI response generation in the same call 
                // but usually returns the user message status. 
                // We should re-fetch or wait for the bot message logic in chat.py

                // Let's check how the backend sends the bot response. 
                // Ah, the backend `send_message` returns MessageResponse with the user message.
                // The bot response is also saved to the DB.

                // To keep it simple and reactive, we'll re-fetch history or 
                // rely on the backend returning the bot message. 
                // Let's modify the backend to return BOTH messages if it's a bot.

                // Wait, let's look at chat.py again.
            }
        } catch (err: any) {
            console.error("Chat Error:", err);
        } finally {
            setIsTyping(false);
            // Re-fetch to get the bot's reply
            const histRes = await api.get(`/chat/${botId}`);
            if (histRes.data.messages) {
                setMessages(histRes.data.messages.map((m: any) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                })));
            }
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white dark:bg-gray-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h3 className="font-black text-xl leading-none">{botName}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">AI Mentor</span>
                    </div>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                    <Bot size={20} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-4 rounded-2xl font-medium shadow-sm ${msg.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-4 pr-14 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 ring-primary transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
