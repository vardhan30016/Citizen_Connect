import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerAdmin, registerModerator, registerPolitician, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import {
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiMapPin,
    FiUserPlus
} from 'react-icons/fi';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        constituency: '',
        role: 'CITIZEN'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

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

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            constituency: formData.constituency,
            role: formData.role
        };

        const thunkMap = {
            CITIZEN: register,
            POLITICIAN: registerPolitician,
            ADMIN: registerAdmin,
            MODERATOR: registerModerator,
        };

        const thunk = thunkMap[formData.role] || register;

        try {
            await dispatch(thunk(payload)).unwrap();
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card">

                <div className="text-center mb-lg">
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p className="text-muted">Join CitizenConnect</p>
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
                            placeholder="Enter your full name"
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
                            placeholder="Enter your email"
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
                            placeholder="Enter constituency"
                            value={formData.constituency}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Select Role
                        </label>
                        <select
                            name="role"
                            className="form-input"
                            value={formData.role}
                            onChange={handleChange}
                            style = {{
                                backgroundColor: '#1e1e2f',
                                color: 'white'
                            }}
                        >
                            <option value="CITIZEN">Citizen</option>
                            <option value="POLITICIAN">Politician</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MODERATOR">Moderator</option>
                        </select>
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
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FiUserPlus />
                                Create Account
                            </>
                        )}
                    </button>

                </form>

                <div className="text-center mt-lg">
                    <p className="text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary">
                            Sign in here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;