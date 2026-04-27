import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus, FiShield } from 'react-icons/fi';

function AdminRegister() {
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

    // Only allow admins to access this page
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="card">
                    <div className="text-center">
                        <h1>Access Denied</h1>
                        <p>You don't have permission to access this page.</p>
                        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

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
            await dispatch(registerAdmin({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                constituency: formData.constituency
            })).unwrap();

            toast.success('Admin registration successful!');
            navigate('/admin');

        } catch (err) {
            toast.error(err || 'Admin registration failed. Please try again.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card">
                <div className="text-center mb-lg">
                    <FiShield size={48} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Register New Admin</h1>
                    <p className="text-muted">Create a new administrator account</p>
                </div>

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
                            placeholder="Enter admin's full name"
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
                            name="email"
                            className="form-input"
                            placeholder="Enter admin's email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiLock style={{ marginRight: '0.5rem' }} />
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
                                <FiLock style={{ marginRight: '0.5rem' }} />
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

                    <div className="form-group">
                        <label className="form-label">
                            <FiUser style={{ marginRight: '0.5rem' }} />
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
                            <FiUser style={{ marginRight: '0.5rem' }} />
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
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                Creating Admin Account...
                            </>
                        ) : (
                            <>
                                <FiUserPlus />
                                Create Admin Account
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-lg">
                    <Link to="/admin" className="btn btn-secondary">
                        Back to Admin Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;