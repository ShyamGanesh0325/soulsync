import axios from 'axios';
import type { UserProfile, PredictionResponse } from './types';

export const API_URL = 'https://soulsync-erxq.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log("🌐 SoulSync API Connection initialized at:", API_URL);

// Auth Interfaces
export interface UserLogin {
    email: string;
    password: string;
}

export interface UserCreate extends Partial<UserProfile> {
    email: string;
    password: string;
    full_name: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

// Axios Interceptor for Auth
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (user: UserCreate): Promise<any> => {
    try {
        const response = await api.post('/auth/register', user);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const login = async (credentials: UserLogin): Promise<Token> => {
    try {
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        // For login, we don't send default JSON header because it's form data
        const response = await api.post<Token>('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const predictCompatibility = async (profile: UserProfile): Promise<PredictionResponse> => {
    try {
        const response = await api.post<PredictionResponse>('/predict_compatibility', profile);
        return response.data;
    } catch (error) {
        console.error("Error predicting compatibility:", error);
        throw error;
    }
};

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'match';
    timestamp: string;
    is_toxic?: boolean;
}

export interface MessageResponse {
    success: boolean;
    is_toxic: boolean;
    warning?: string;
    message?: Message;
}

export const getChatHistory = async (matchId: string): Promise<Message[]> => {
    try {
        const response = await api.get<{ messages: Message[] }>(`/chat/${matchId}`);
        return response.data.messages;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};

export const sendMessage = async (matchId: string, text: string): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/chat/send', {
            match_id: matchId,
            text: text,
            sender: 'user'
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export interface UserResponse extends UserProfile {
    id: number;
    email: string;
    full_name: string;
}

export const getCurrentUser = async (): Promise<UserResponse> => {
    try {
        const response = await api.get<UserResponse>('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
