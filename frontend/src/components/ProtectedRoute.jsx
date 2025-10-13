import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, setView }) => {
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        if (!user) {
            setView({ page: 'login' });
        }
    }, [user, setView]);
    
    if (!user) {
        return null;
    }
    
    return children;
};

export default ProtectedRoute;