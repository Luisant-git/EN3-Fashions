import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import { updateShippingAddress, updateProfile } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, loading, refreshUser } = useContext(AuthContext);
    const [profileLoading, setProfileLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [selectedState, setSelectedState] = useState(null);

    const stateOptions = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ].map(state => ({ value: state, label: state }));

    React.useEffect(() => {
        if (user?.shippingAddress?.state) {
            setSelectedState({ value: user.shippingAddress.state, label: user.shippingAddress.state });
        }
    }, [user]);

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
        if (!selectedState) {
            toast.error('Please select a state');
            return;
        }
        setAddressLoading(true);
        const formData = new FormData(e.target);
        const address = {
            name: formData.get('name'),
            addressLine: formData.get('addressLine'),
            landmark: formData.get('landmark'),
            city: formData.get('city'),
            state: selectedState.value,
            pincode: formData.get('pincode'),
            mobile: formData.get('mobile')
        };
        try {
            await updateShippingAddress(localStorage.getItem('token'), address);
            await refreshUser();
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
                        <input type="text" name="landmark" placeholder="Landmark" defaultValue={user?.shippingAddress?.landmark} />
                        <div className="form-row">
                           <input type="text" name="city" placeholder="City" defaultValue={user?.shippingAddress?.city} required />
                        </div>
                        <select 
                            value={selectedState?.value || ''} 
                            onChange={(e) => setSelectedState(e.target.value ? { value: e.target.value, label: e.target.value } : null)}
                            required
                        >
                            <option value="">Select State</option>
                            {stateOptions.map(state => (
                                <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                        </select>
                        <input type="text" name="pincode" placeholder="Pincode" defaultValue={user?.shippingAddress?.pincode} required />
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