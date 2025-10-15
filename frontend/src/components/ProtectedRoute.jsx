import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    if (!user) {
        return null;
    }
    
    return children;
};

export default ProtectedRoute;