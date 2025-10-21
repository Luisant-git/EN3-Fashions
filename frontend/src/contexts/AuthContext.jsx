import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetch('http://localhost:4062/user/profile/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                const { password, ...userData } = data;
                setUser(userData);
            })
            .catch((err) => {
                console.error('Profile fetch error:', err);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            });
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            const { access_token } = response;
            
            localStorage.setItem('token', access_token);
            setToken(access_token);
            
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            return false;
        }
    };

    const signup = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await registerUser({ name, email, password });
            const { access_token } = response;
            
            localStorage.setItem('token', access_token);
            setToken(access_token);
            
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            setLoading(false);
            return false;
        }
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};