import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { getChatHistory, sendMessage, type Message } from '../api';

interface ChatWindowProps {
    matchId: string;
    matchName: string;
    onBack: () => void;
    isBot?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ matchId, matchName, onBack, isBot }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [toxicWarning, setToxicWarning] = useState(false);
    const [botFeedback, setBotFeedback] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadChatHistory = React.useCallback(async () => {
        try {
            const msgs = await getChatHistory(matchId);
            setMessages(msgs || []);
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    }, [matchId]);

    // Load chat history
    useEffect(() => {
        loadChatHistory();
    }, [loadChatHistory]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isSending) return;

        setIsSending(true);
        setToxicWarning(false);

        try {
            const response = await sendMessage(matchId, inputText);

            if (response.is_toxic) {
                setToxicWarning(true);
                setTimeout(() => setToxicWarning(false), 3000);
            } else {
                setInputText('');
                // Ideally append the message locally for instant feedback, then re-fetch
                // Or just re-fetch.
                setTimeout(() => {
                    loadChatHistory();
                    if (isBot) {
                        const feedbacks = [
                            "Perfect frequency alignment! ✨",
                            "Good effort, but try adding more 'Vibe Sparks'! ⚡",
                            "You're being very empathic. Luna approves! 🌙",
                            "Atlas is impressed! Your charisma is rising. 🚀"
                        ];
                        setBotFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
                        setTimeout(() => setBotFeedback(null), 5000);
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <div className={`p-4 flex items-center gap-3 shadow-lg ${isBot ? 'bg-gradient-to-r from-indigo-600 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-lg">{matchName}</h2>
                        {isBot && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white font-black uppercase tracking-widest border border-white/30">AI Coach</span>}
                    </div>
                    <p className="text-white/80 text-sm">{isBot ? '🧬 Practice Resonance Active' : 'Active now'}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                {msg.is_toxic && (
                                    <p className="text-xs mt-1 text-red-500 dark:text-red-400 font-medium">⚠️ Flagged as inappropriate</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* AI Feedback Overlay */}
            <AnimatePresence>
                {botFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mx-4 mb-2 p-3 bg-indigo-600/90 backdrop-blur-md text-white rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-400/30"
                    >
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">💡</div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Coach Insight</p>
                            <p className="text-sm font-bold">{botFeedback}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toxic Warning */}
            <AnimatePresence>
                {toxicWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mx-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"
                    >
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                        <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                            This message contains inappropriate content. Please be respectful.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isSending}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
