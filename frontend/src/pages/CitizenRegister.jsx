import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus, FiMapPin, FiPhone } from 'react-icons/fi';

function CitizenRegister() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        constituency: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    // Only allow admins
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="card">
                    <div className="text-center">
                        <h1>Access Denied</h1>
                        <p>You don't have permission to access this page.</p>
                        <Link to="/dashboard" className="btn btn-primary mt-md">Go to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await dispatch(register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                constituency: formData.constituency,
                role: 'CITIZEN'
            })).unwrap();

            toast.success('Citizen account created successfully!');
            navigate('/admin');
        } catch (err) {
            toast.error(err || 'Citizen registration failed. Please try again.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div className="card">
                {/* Header */}
                <div className="text-center mb-lg">
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', margin: '0 auto 1rem',
                        boxShadow: '0 8px 20px rgba(16,185,129,0.35)'
                    }}>👤</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                        Register New Citizen
                    </h1>
                    <p className="text-muted">Create a citizen account on behalf of a user</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiUser style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            placeholder="Enter citizen's full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiMail style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter citizen's email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiLock style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <FiLock style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiPhone style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
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

                    {/* Constituency */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiMapPin style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Constituency
                        </label>
                        <input
                            type="text"
                            name="constituency"
                            className="form-input"
                            placeholder="Enter constituency"
                            value={formData.constituency}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className="form-error mb-md">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                Creating Citizen Account...
                            </>
                        ) : (
                            <>
                                <FiUserPlus />
                                Create Citizen Account
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-lg">
                    <Link to="/admin" className="btn btn-secondary">
                        ← Back to Admin Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CitizenRegister;
