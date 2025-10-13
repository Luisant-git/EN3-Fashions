import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = (email, password) => {
        setLoading(true);
        return new Promise(resolve => {
            setTimeout(() => {
                if (email && password) {
                    setUser({ name: 'Test User', email: email });
                    resolve(true);
                } else {
                    resolve(false);
                }
                setLoading(false);
            }, 1000);
        });
    };

    const signup = (name, email, password) => {
        setLoading(true);
        return new Promise(resolve => {
            setTimeout(() => {
                if (name && email && password) {
                    setUser({ name, email });
                    resolve(true);
                } else {
                    resolve(false);
                }
                setLoading(false);
            }, 1000);
        });
    };
    
    const logout = () => {
        setLoading(true);
        setTimeout(() => {
            setUser(null);
            setLoading(false);
        }, 500);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};