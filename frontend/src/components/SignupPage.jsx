import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, loading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(name, email, password);
        if (success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error('Failed to create account. Please try again.');
        }
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
                <p>Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); navigate('/login');}}>Login</a></p>
            </div>
        </div>
    );
};

export default SignupPage;