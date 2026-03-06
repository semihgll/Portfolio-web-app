import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Admin olarak kabul edilecek email adresi
// Firebase Console'da Authentication > Users kısmından kontrol edebilirsin
const ADMIN_EMAIL = ''; // İlk giriş sonrası otomatik ayarlanacak

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    adminEmail: string;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    loading: true,
    adminEmail: '',
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, adminEmail }: { children: ReactNode; adminEmail: string }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const isAdmin = !!user && !!adminEmail && user.email === adminEmail;

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, adminEmail, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
