import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config/api';

const API_URL = API_BASE_URL || 'http://195.35.22.221:4062';

const LoginPage = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isNewUser, setIsNewUser] = useState(false);

    React.useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/otp/request`, { phone });
            setIsNewUser(data.isNewUser || false);
            toast.success('OTP sent to WhatsApp!');
            setTimer(180);
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/otp/verify`, { phone, otp, name, email });
            localStorage.setItem('token', data.access_token);
            toast.success('Login successful!');
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login</h2>
                {step === 1 ? (
                    <form onSubmit={requestOtp}>
                        <input type="tel" placeholder="Enter Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} required/>
                        <button type="submit" disabled={loading}>
                            {loading ? <LoadingSpinner /> : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp}>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required/>
                        {isNewUser && (
                            <>
                                <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)}/>
                                <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)}/>
                            </>
                        )}
                        <button type="submit" disabled={loading}>
                            {loading ? <LoadingSpinner /> : 'Verify & Login'}
                        </button>
                        <p style={{ marginTop: '10px' }}>
                            {timer > 0 ? (
                                <span>Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                            ) : (
                                <a href="#" onClick={(e) => { e.preventDefault(); setStep(1); setOtp(''); }}>Resend OTP</a>
                            )}
                        </p>
                    </form>
                )}

            </div>
        </div>
    );
};

export default LoginPage;