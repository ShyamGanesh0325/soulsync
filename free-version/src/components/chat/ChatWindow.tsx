'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, ArrowLeft, Sparkles } from 'lucide-react';
import { Message, ChatResponse } from '@/types';

interface ChatWindowProps {
    botId: 'bot_luna' | 'bot_atlas';
    botName: string;
    onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ botId, botName, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hello! I'm ${botName}, your SoulSync AI mentor. How's your energy today? ✨`
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isTyping) return;

        const userMsg: Message = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botId,
                    message: inputText,
                    history: messages
                }),
            });

            const data: ChatResponse = await response.json();

            if (data.success) {
                const assistantMsg: Message = { role: 'assistant', content: data.reply };
                setMessages(prev => [...prev, assistantMsg]);
            } else {
                throw new Error(data.error || 'Failed to get resonance');
            }
        } catch (err: any) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I felt a ripple in the energy... let's try that again later. 💫"
            }]);
        } finally {
            setIsTyping(false);
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
