import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, setToken, getToken } from '../services/api';

interface User {
    _id: string;
    email: string;
    fullName: string;
    role: 'student' | 'admin';
    department: string;
    graduationYear: number;
    studentId: string;
    profilePhoto: string;
    quote: string;
    bio: string;
    rememberMeFor: string;
    hobbies: string[];
    achievements: string[];
    isActivated: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; fullName: string; studentId?: string }) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const userData = await userApi.getMe();
                    setUser(userData);
                } catch {
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { user: userData, token } = await authApi.login(email, password);
        setToken(token);
        setUser(userData);
    };

    const register = async (data: { email: string; password: string; fullName: string; studentId?: string }) => {
        const { user: userData, token } = await authApi.register(data);
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const updateUser = async (data: Partial<User>) => {
        const updated = await userApi.updateMe(data);
        setUser(updated);
    };

    const refreshUser = async () => {
        const userData = await userApi.getMe();
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
