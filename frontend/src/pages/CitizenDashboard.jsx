import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { citizenAPI } from '../api/api';
import { toast } from 'react-toastify';
import {
    FiFileText, FiCheckCircle, FiClock, FiAlertCircle,
    FiPlus, FiBell, FiStar, FiMessageSquare
} from 'react-icons/fi';

function CitizenDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({});
    const [myIssues, setMyIssues] = useState([]);
    const [myFeedback, setMyFeedback] = useState([]);
    const [constituencyUpdates, setConstituencyUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'CITIZEN') {
            fetchCitizenData();
        }
    }, [user]);

    const fetchCitizenData = async () => {
        try {
            setLoading(true);
            const [statsRes, issuesRes, feedbackRes, updatesRes] = await Promise.all([
                citizenAPI.getDashboardStats(),
                citizenAPI.getMyIssues(),
                citizenAPI.getMyFeedback(),
                citizenAPI.getConstituencyUpdates()
            ]);
            setStats(statsRes.data.data);
            setMyIssues(issuesRes.data.data || []);
            setMyFeedback(feedbackRes.data.data || []);
            setConstituencyUpdates(updatesRes.data.data || []);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            OPEN: 'badge-open',
            IN_PROGRESS: 'badge-in-progress',
            RESOLVED: 'badge-resolved',
            CLOSED: 'badge-closed'
        };
        return badges[status] || 'badge-open';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="page-container">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div className="dashboard-welcome">
                    <div className="user-avatar-large">
                        {getInitials(user?.fullName)}
                    </div>
                    <div>
                        <h1 className="page-title">Welcome, {user?.fullName}!</h1>
                        <p className="page-description">
                            Report issues, track progress, and stay connected with your representatives.
                        </p>
                    </div>
                </div>
                <Link to="/issues/create" className="btn btn-primary btn-lg">
                    <FiPlus /> Report New Issue
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary"><FiFileText /></div>
                    <div className="stat-value">{stats.totalIssuesSubmitted || 0}</div>
                    <div className="stat-label">Issues Submitted</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon cyan"><FiAlertCircle /></div>
                    <div className="stat-value">{stats.openIssues || 0}</div>
                    <div className="stat-label">Open Issues</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon amber"><FiClock /></div>
                    <div className="stat-value">{stats.resolvedIssues || 0}</div>
                    <div className="stat-label">Resolved</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon emerald"><FiMessageSquare /></div>
                    <div className="stat-value">{stats.totalFeedbackSubmitted || 0}</div>
                    <div className="stat-label">Feedback Given</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* My Issues Section */}
                <div className="col-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <FiFileText style={{ marginRight: '0.5rem' }} />
                                My Reported Issues
                            </h2>
                            <Link to="/issues" className="btn btn-secondary btn-sm">View All</Link>
                        </div>

                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : myIssues.length > 0 ? (
                            <div>
                                {myIssues.slice(0, 5).map((issue) => (
                                    <Link to={`/issues/${issue.id}`} key={issue.id} className="issue-card">
                                        <div className="issue-header">
                                            <div>
                                                <h3 className="issue-title">{issue.title}</h3>
                                                <div className="issue-meta">
                                                    <span>{issue.category}</span>
                                                    <span>•</span>
                                                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <span className={`badge ${getStatusBadge(issue.status)}`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="issue-description">
                                            {issue.description?.length > 120
                                                ? issue.description.substring(0, 120) + '...'
                                                : issue.description}
                                        </p>
                                        {issue.assignedPoliticianName && (
                                            <div className="issue-assigned">
                                                Assigned to: {issue.assignedPoliticianName}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3 className="empty-state-title">No issues reported yet</h3>
                                <p className="empty-state-description">
                                    Have a concern in your area? Report it and get help from your representatives.
                                </p>
                                <Link to="/issues/create" className="btn btn-primary">
                                    Report Your First Issue
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-4">
                    {/* Quick Actions */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                        <div className="quick-actions">
                            <Link to="/issues/create" className="quick-action-btn">
                                <FiPlus /> Report Issue
                            </Link>
                            <Link to="/politicians" className="quick-action-btn">
                                <FiStar /> Rate Politicians
                            </Link>
                            <Link to="/feedback" className="quick-action-btn">
                                <FiMessageSquare /> My Feedback
                            </Link>
                        </div>
                    </div>

                    {/* Recent Updates */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                <FiBell style={{ marginRight: '0.5rem' }} />
                                Latest Updates
                            </h2>
                        </div>

                        {constituencyUpdates.length > 0 ? (
                            <div>
                                {constituencyUpdates.slice(0, 4).map((update) => (
                                    <div key={update.id} className="update-item">
                                        <h4 className="update-title">{update.title}</h4>
                                        <p className="update-meta">
                                            by {update.politicianName} • {new Date(update.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="update-content">
                                            {update.content?.length > 100
                                                ? update.content.substring(0, 100) + '...'
                                                : update.content}
                                        </p>
                                    </div>
                                ))}
                                <Link to="/updates" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                                    View All Updates
                                </Link>
                            </div>
                        ) : (
                            <p className="text-muted">No updates from your constituency yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CitizenDashboard;
