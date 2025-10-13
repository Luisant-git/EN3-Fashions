import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const LoginPage = ({ setView }) => {
    const { login, loading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            setView({ page: 'home' });
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };
    
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); setView({ page: 'signup' });}}>Sign Up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;