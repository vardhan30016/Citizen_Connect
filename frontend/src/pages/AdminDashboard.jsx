import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';
import { FiUsers, FiFileText, FiShield, FiUserCheck, FiTrash2, FiFilter, FiUserPlus, FiStar } from 'react-icons/fi';

function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        filterUsers();
    }, [users, roleFilter]);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                adminAPI.getAllUsers(),
                adminAPI.getDashboardStats()
            ]);
            setUsers(usersRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (roleFilter === 'ALL') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(u => u.role === roleFilter));
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('Role updated successfully');
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleEnableUser = async (userId) => {
        try {
            await adminAPI.enableUser(userId);
            setUsers(users.map(u => u.id === userId ? { ...u, enabled: true } : u));
            toast.success('User enabled successfully');
        } catch (error) {
            toast.error('Failed to enable user');
        }
    };

    const handleDisableUser = async (userId) => {
        try {
            await adminAPI.disableUser(userId);
            setUsers(users.map(u => u.id === userId ? { ...u, enabled: false } : u));
            toast.success('User disabled successfully');
        } catch (error) {
            toast.error('Failed to disable user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast.success('User deleted');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
        return <Navigate to="/dashboard" />;
    }

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-description">Manage users and monitor platform activity.</p>
                </div>
                <div className="flex gap-md" style={{ flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Link to="/admin/register" className="btn btn-primary">
                        <FiUserPlus /> Register Admin
                    </Link>
                    <Link to="/admin/register-moderator" className="btn btn-secondary">
                        <FiShield /> Register Moderator
                    </Link>
                    <Link to="/admin/register-politician" className="btn btn-outline" style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}>
                        <FiStar /> Add Politician
                    </Link>
                    <Link to="/admin/register-citizen" className="btn btn-outline" style={{ borderColor: '#10b981', color: '#059669' }}>
                        <FiUsers /> Add Citizen
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary"><FiUsers /></div>
                    <div className="stat-value">{stats.totalCitizens || 0}</div>
                    <div className="stat-label">Citizens</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon cyan"><FiUserCheck /></div>
                    <div className="stat-value">{stats.totalPoliticians || 0}</div>
                    <div className="stat-label">Politicians</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon amber"><FiShield /></div>
                    <div className="stat-value">{stats.totalModerators || 0}</div>
                    <div className="stat-label">Moderators</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon emerald"><FiFileText /></div>
                    <div className="stat-value">{stats.totalIssues || 0}</div>
                    <div className="stat-label">Total Issues</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-md mb-lg">
                <button
                    className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
            </div>

            {/* Users Table */}
            {activeTab === 'users' && (
                <div className="card">
                    <div className="flex justify-between items-center mb-lg">
                        <h2 className="card-title">All Users</h2>
                        <div className="flex items-center gap-md">
                            <FiFilter />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="form-select"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="CITIZEN">Citizens</option>
                                <option value="POLITICIAN">Politicians</option>
                                <option value="MODERATOR">Moderators</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="form-select"
                                                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                disabled={u.id === user.id}
                                            >
                                                <option value="CITIZEN">Citizen</option>
                                                <option value="POLITICIAN">Politician</option>
                                                <option value="MODERATOR">Moderator</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.enabled ? 'badge-resolved' : 'badge-closed'}`}>
                                                {u.enabled ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex gap-sm">
                                                {u.enabled ? (
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => handleDisableUser(u.id)}
                                                        disabled={u.id === user.id}
                                                    >
                                                        Disable
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleEnableUser(u.id)}
                                                        disabled={u.id === user.id}
                                                    >
                                                        Enable
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    disabled={u.id === user.id}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="card">
                    <h2 className="card-title mb-lg">Issue Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value text-warning">{stats.issuesByStatus?.open || 0}</div>
                            <div className="stat-label">Open</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                                {stats.issuesByStatus?.inProgress || 0}
                            </div>
                            <div className="stat-label">In Progress</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value text-success">{stats.issuesByStatus?.resolved || 0}</div>
                            <div className="stat-label">Resolved</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value text-muted">{stats.issuesByStatus?.closed || 0}</div>
                            <div className="stat-label">Closed</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
