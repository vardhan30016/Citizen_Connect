import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn, FiShield } from 'react-icons/fi';
import SimpleCaptcha from '../components/SimpleCaptcha';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaVerified) {
            toast.error('Please complete the security verification before signing in.');
            return;
        }

        try {
            await dispatch(login(formData)).unwrap();
            toast.success('Login successful! Welcome back.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span>🏛️</span>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your CitizenConnect account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
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
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiLock style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CAPTCHA */}
                    <div className="form-group">
                        <SimpleCaptcha onVerify={setCaptchaVerified} />
                    </div>

                    {error && <p className="form-error mb-md">{error}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg login-submit-btn"
                        disabled={loading || !captchaVerified}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FiLogIn />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Security Note */}
                <div className="login-security-note">
                    <FiShield style={{ color: 'var(--primary-500)', marginRight: '0.4rem' }} />
                    <span>Protected by security verification</span>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary login-link">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
