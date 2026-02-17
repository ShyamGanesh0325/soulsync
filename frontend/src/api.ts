import axios from 'axios';
import type { UserProfile, PredictionResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
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
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (user: UserCreate): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, user);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const login = async (credentials: UserLogin): Promise<Token> => {
    try {
        // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const response = await axios.post<Token>(`${API_URL}/auth/login`, formData);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const predictCompatibility = async (profile: UserProfile): Promise<PredictionResponse> => {
    try {
        const response = await axios.post<PredictionResponse>(`${API_URL}/predict_compatibility`, profile);
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
        const response = await axios.get<{ messages: Message[] }>(`${API_URL}/chat/${matchId}`);
        return response.data.messages;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};

export const sendMessage = async (matchId: string, text: string): Promise<MessageResponse> => {
    try {
        const response = await axios.post<MessageResponse>(`${API_URL}/chat/send`, {
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
        const response = await axios.get<UserResponse>(`${API_URL}/auth/me`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
