import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useContext(AuthContext);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setTimeout(() => {
            alert('Password changed successfully! (mock)');
            e.target.reset();
            setPasswordLoading(false);
        }, 1000);
    };

    const handleAddressUpdate = (e) => {
        e.preventDefault();
        setAddressLoading(true);
        setTimeout(() => {
            alert('Shipping address updated! (mock)');
            setAddressLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Account</h1>
                    <button onClick={handleLogout} className="logout-btn" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Logout'}
                    </button>
                </div>

                <div className="profile-section user-info">
                    <h2>Profile Information</h2>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <button onClick={() => navigate('/orders')} className="view-orders-btn">View My Orders</button>
                </div>

                <div className="profile-section">
                    <h2>Change Password</h2>
                    <form className="profile-form" onSubmit={handlePasswordChange}>
                        <input type="password" placeholder="Current Password" required />
                        <input type="password" placeholder="New Password" required />
                        <input type="password" placeholder="Confirm New Password" required />
                        <button type="submit" disabled={passwordLoading}>
                            {passwordLoading ? <LoadingSpinner /> : 'Update Password'}
                        </button>
                    </form>
                </div>

                <div className="profile-section">
                    <h2>Shipping Address</h2>
                    <form className="profile-form" onSubmit={handleAddressUpdate}>
                        <input type="text" placeholder="Full Name" defaultValue={user?.name} required />
                        <input type="text" placeholder="Address Line 1" required />
                        <div className="form-row">
                           <input type="text" placeholder="City" required />
                           <input type="text" placeholder="Pincode" required />
                        </div>
                        <input type="tel" placeholder="Mobile Number" required />
                        <button type="submit" disabled={addressLoading}>
                            {addressLoading ? <LoadingSpinner /> : 'Save Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;