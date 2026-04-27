import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { moderatorAPI } from '../api/api';
import { toast } from 'react-toastify';
import {
    FiFlag, FiCheckCircle, FiAlertTriangle, FiMessageSquare,
    FiShield, FiTrash2, FiCheck, FiX, FiFileText, FiEye,
    FiUserPlus
} from 'react-icons/fi';

function ModeratorDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [pendingIssues, setPendingIssues] = useState([]);
    const [allIssues, setAllIssues] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [rejectReason, setRejectReason] = useState('');
    const [selectedIssue, setSelectedIssue] = useState(null);

    useEffect(() => {
        if (user?.role === 'MODERATOR') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pendingRes, statsRes] = await Promise.all([
                moderatorAPI.getPendingIssues(),
                moderatorAPI.getDashboardStats()
            ]);
            setPendingIssues(pendingRes.data.data || []);
            setStats(statsRes.data.data || {});
        } catch (error) {
            toast.error('Failed to fetch moderation data');
        } finally {
            setLoading(false);
        }
    };

    const loadAllIssues = async () => {
        try {
            const response = await moderatorAPI.getAllIssues();
            setAllIssues(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load issues');
        }
    };

    const loadAllComments = async () => {
        try {
            const response = await moderatorAPI.getAllComments();
            setAllComments(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load comments');
        }
    };

    const handleApproveIssue = async (issueId) => {
        try {
            await moderatorAPI.approveIssue(issueId);
            setPendingIssues(prev => prev.filter(issue => issue.id !== issueId));
            toast.success('Issue approved successfully');
        } catch (error) {
            toast.error('Failed to approve issue');
        }
    };

    const handleRejectIssue = async (issueId) => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            await moderatorAPI.rejectIssue(issueId, rejectReason);
            setPendingIssues(prev => prev.filter(issue => issue.id !== issueId));
            setRejectReason('');
            setSelectedIssue(null);
            toast.success('Issue rejected');
        } catch (error) {
            toast.error('Failed to reject issue');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await moderatorAPI.deleteComment(commentId);
            setAllComments(prev => prev.filter(comment => comment.id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    if (user?.role !== 'MODERATOR') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Moderator Dashboard</h1>
                <p className="page-description">Review issues and comments to maintain platform quality.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon amber"><FiAlertTriangle /></div>
                    <div className="stat-value">{stats.pendingIssues || 0}</div>
                    <div className="stat-label">Pending Issues</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon emerald"><FiCheckCircle /></div>
                    <div className="stat-value">{stats.approvedIssues || 0}</div>
                    <div className="stat-label">Approved Issues</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon rose"><FiX /></div>
                    <div className="stat-value">{stats.rejectedIssues || 0}</div>
                    <div className="stat-label">Rejected Issues</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon primary"><FiMessageSquare /></div>
                    <div className="stat-value">{stats.totalComments || 0}</div>
                    <div className="stat-label">Total Comments</div>
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
                    className={`btn ${activeTab === 'issues' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                        setActiveTab('issues');
                        loadAllIssues();
                    }}
                >
                    Issue Moderation
                </button>
                <button
                    className={`btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                        setActiveTab('comments');
                        loadAllComments();
                    }}
                >
                    Comment Moderation
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="card">
                    <h2 className="card-title mb-lg">Pending Issues Review</h2>
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : pendingIssues.length > 0 ? (
                        <div className="moderation-queue">
                            {pendingIssues.map((issue) => (
                                <div key={issue.id} className="moderation-item">
                                    <div className="moderation-content">
                                        <div className="moderation-header">
                                            <span className="moderation-author">
                                                <strong>{issue.citizenName}</strong>
                                            </span>
                                            <span className="moderation-date">
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="moderation-title">{issue.title}</h4>
                                        <p className="moderation-text">{issue.description}</p>
                                        <div className="moderation-context">
                                            <span>Category: {issue.category}</span>
                                            <span>Priority: {issue.priority}</span>
                                        </div>
                                    </div>
                                    <div className="moderation-actions">
                                        <button
                                            onClick={() => handleApproveIssue(issue.id)}
                                            className="btn btn-success btn-sm"
                                            title="Approve issue"
                                        >
                                            <FiCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => setSelectedIssue(issue)}
                                            className="btn btn-danger btn-sm"
                                            title="Reject issue"
                                        >
                                            <FiX /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">✅</div>
                            <h3 className="empty-state-title">All Caught Up!</h3>
                            <p className="empty-state-description">
                                No pending issues to review. Great job maintaining platform quality!
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
                <div className="card">
                    <h2 className="card-title mb-lg">All Issues</h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Citizen</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allIssues.map((issue) => (
                                    <tr key={issue.id}>
                                        <td>{issue.title}</td>
                                        <td>{issue.citizenName}</td>
                                        <td>
                                            <span className={`badge ${
                                                issue.status === 'APPROVED' ? 'badge-resolved' :
                                                issue.status === 'REJECTED' ? 'badge-closed' :
                                                'badge-pending'
                                            }`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td>{issue.priority}</td>
                                        <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex gap-sm">
                                                {issue.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveIssue(issue.id)}
                                                            className="btn btn-success btn-sm"
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedIssue(issue)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </>
                                                )}
                                                <Link
                                                    to={`/issues/${issue.id}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <FiEye />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
                <div className="card">
                    <h2 className="card-title mb-lg">All Comments</h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Comment</th>
                                    <th>Author</th>
                                    <th>Issue</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allComments.map((comment) => (
                                    <tr key={comment.id}>
                                        <td>{comment.content}</td>
                                        <td>{comment.authorName}</td>
                                        <td>{comment.issueTitle || `#${comment.issueId}`}</td>
                                        <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Reason Modal */}
            {selectedIssue && (
                <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reject Issue</h3>
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Issue:</strong> {selectedIssue.title}</p>
                            <div className="form-group">
                                <label className="form-label">Rejection Reason</label>
                                <textarea
                                    className="form-input"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Please provide a reason for rejection..."
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRejectIssue(selectedIssue.id)}
                                className="btn btn-danger"
                            >
                                Reject Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModeratorDashboard;
