import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const SignupPage = ({ setView }) => {
    const { signup, loading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(name, email, password);
        setView({ page: 'home' });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required/>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    <button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Sign Up'}
                    </button>
                </form>
                <p>Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); setView({ page: 'login' });}}>Login</a></p>
            </div>
        </div>
    );
};

export default SignupPage;