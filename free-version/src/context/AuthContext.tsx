'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
    id: number;
    email: string;
    full_name: string;
    age?: number;
    gender?: string;
    location?: string;
    openness?: number;
    extroversion?: number;
    agreeableness?: number;
    neuroticism?: number;
    conscientiousness?: number;
    likes_music?: boolean;
    likes_travel?: boolean;
    likes_pets?: boolean;
    foodie?: boolean;
    gym_person?: boolean;
    gamer?: boolean;
    reader?: boolean;
    night_owl?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => void;
    checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
