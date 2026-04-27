import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { userAPI } from '../api/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';

function Profile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        constituency: user?.constituency || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await userAPI.update(user.id, formData);
            dispatch(updateUser(res.data.data));
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadge = (role) => {
        const badges = {
            ADMIN: 'badge-admin',
            POLITICIAN: 'badge-politician',
            CITIZEN: 'badge-citizen',
            MODERATOR: 'badge-moderator'
        };
        return badges[role] || 'badge-citizen';
    };

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card">
                {/* Profile Header */}
                <div className="text-center mb-lg">
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: '600',
                        margin: '0 auto 1rem'
                    }}>
                        {getInitials(user?.fullName)}
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {user?.fullName}
                    </h1>
                    <span className={`badge ${getRoleBadge(user?.role)}`}>
                        {user?.role}
                    </span>
                    <p className="text-muted mt-sm">{user?.email}</p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Profile Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <FiUser style={{ marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiMail style={{ marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-input"
                            value={user?.email}
                            disabled
                            style={{ opacity: 0.7 }}
                        />
                        <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
                            Email cannot be changed
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiPhone style={{ marginRight: '0.5rem' }} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiMapPin style={{ marginRight: '0.5rem' }} />
                            Constituency
                        </label>
                        <input
                            type="text"
                            name="constituency"
                            className="form-input"
                            placeholder="Enter your constituency"
                            value={formData.constituency}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <FiSave /> Save Changes
                            </>
                        )}
                    </button>
                </form>

                {/* Account Info */}
                <div className="mt-lg" style={{
                    padding: '1rem',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem'
                }}>
                    <p className="text-muted">
                        <strong>Account created:</strong> {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-muted mt-sm">
                        <strong>Status:</strong> {user?.enabled ? 'Active' : 'Inactive'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
