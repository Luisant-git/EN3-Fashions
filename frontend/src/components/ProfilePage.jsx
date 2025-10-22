import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { updateShippingAddress, updateProfile } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useContext(AuthContext);
    const [profileLoading, setProfileLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        const formData = new FormData(e.target);
        const profile = {
            name: formData.get('name'),
            email: formData.get('email')
        };
        try {
            await updateProfile(localStorage.getItem('token'), profile);
            toast.success('Profile updated successfully!');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update profile');
        }
        setProfileLoading(false);
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        setAddressLoading(true);
        const formData = new FormData(e.target);
        const address = {
            name: formData.get('name'),
            addressLine: formData.get('addressLine'),
            city: formData.get('city'),
            pincode: formData.get('pincode'),
            mobile: formData.get('mobile')
        };
        try {
            await updateShippingAddress(localStorage.getItem('token'), address);
            toast.success('Shipping address updated successfully!');
        } catch (error) {
            toast.error('Failed to update address');
        }
        setAddressLoading(false);
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

                <div className="profile-section">
                    <h2>Profile Information</h2>
                    <form className="profile-form" onSubmit={handleProfileUpdate}>
                        <input type="text" name="name" placeholder="Name" defaultValue={user?.name} required />
                        <input type="email" name="email" placeholder="Email" defaultValue={user?.email} />
                        <input type="tel" placeholder="Phone" value={user?.phone} disabled />
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                                {profileLoading ? <LoadingSpinner /> : 'Update Profile'}
                            </button>
                            <button type="button" onClick={() => navigate('/orders')} className="btn btn-secondary">View My Orders</button>
                        </div>
                    </form>
                </div>

                <div className="profile-section">
                    <h2>Shipping Address</h2>
                    <form className="profile-form" onSubmit={handleAddressUpdate}>
                        <input type="text" name="name" placeholder="Full Name" defaultValue={user?.shippingAddress?.name || user?.name} required />
                        <input type="text" name="addressLine" placeholder="Address Line 1" defaultValue={user?.shippingAddress?.addressLine} required />
                        <div className="form-row">
                           <input type="text" name="city" placeholder="City" defaultValue={user?.shippingAddress?.city} required />
                           <input type="text" name="pincode" placeholder="Pincode" defaultValue={user?.shippingAddress?.pincode} required />
                        </div>
                        <input type="tel" name="mobile" placeholder="Mobile Number" defaultValue={user?.shippingAddress?.mobile || user?.phone} required />
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