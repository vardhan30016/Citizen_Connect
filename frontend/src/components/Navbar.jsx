import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FiLogOut, FiHome, FiFileText, FiBell, FiUsers, FiShield, FiSettings } from 'react-icons/fi';

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
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

    const getRoleIcon = (role) => {
        const icons = {
            ADMIN: '👑',
            POLITICIAN: '🏛️',
            CITIZEN: '👤',
            MODERATOR: '🛡️'
        };
        return icons[role] || '👤';
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🏛️</div>
                    <span className="navbar-brand-text">CitizenConnect</span>
                </Link>

                {/* Navigation Links */}
                <div className="navbar-menu">
                    <Link to="/" className="navbar-link">
                        <FiHome /> Home
                    </Link>
                    <Link to="/updates" className="navbar-link">
                        <FiBell /> Updates
                    </Link>
                    <Link to="/politicians" className="navbar-link">
                        <FiUsers /> Politicians
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/issues" className="navbar-link">
                                <FiFileText /> Issues
                            </Link>
                            <Link to="/dashboard" className="navbar-link">
                                {getRoleIcon(user?.role)} Dashboard
                            </Link>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className="navbar-link">
                                    <FiSettings /> Admin Panel
                                </Link>
                            )}
                            {user?.role === 'MODERATOR' && (
                                <Link to="/moderator" className="navbar-link">
                                    <FiShield /> Moderator Panel
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* User Controls */}
                <div className="navbar-user">
                    {isAuthenticated ? (
                        <>
                            <span className={`badge ${getRoleBadge(user?.role)}`}>
                                {getRoleIcon(user?.role)} {user?.role}
                            </span>
                            <Link to="/profile" className="navbar-avatar" title={user?.fullName}>
                                {getInitials(user?.fullName)}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
