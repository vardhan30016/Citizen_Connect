import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIssues, fetchMyIssues, fetchAssignedIssues } from '../store/slices/issueSlice';
import { FiSearch, FiPlus, FiFilter } from 'react-icons/fi';

function Issues() {
    const { user } = useSelector((state) => state.auth);
    const { issues, loading } = useSelector((state) => state.issues);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        if (user?.role === 'CITIZEN') {
            dispatch(fetchMyIssues());
        } else if (user?.role === 'POLITICIAN') {
            dispatch(fetchAssignedIssues());
        } else {
            dispatch(fetchIssues());
        }
    }, [dispatch, user]);

    const getStatusBadge = (status) => {
        const badges = {
            OPEN: 'badge-open',
            IN_PROGRESS: 'badge-in-progress',
            RESOLVED: 'badge-resolved',
            CLOSED: 'badge-closed'
        };
        return badges[status] || 'badge-open';
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page-container">
            <div className="page-header flex-between">
                <div>
                    <h1 className="page-title">Issues</h1>
                    <p className="page-description">
                        {user?.role === 'CITIZEN' && 'View and track your reported issues'}
                        {user?.role === 'POLITICIAN' && 'Manage issues assigned to you'}
                        {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && 'View all issues on the platform'}
                    </p>
                </div>
                {user?.role === 'CITIZEN' && (
                    <Link to="/issues/create" className="btn btn-primary">
                        <FiPlus /> Report Issue
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="card mb-lg">
                <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ position: 'relative' }}>
                            <FiSearch style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Issues List */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : filteredIssues.length > 0 ? (
                <div>
                    {filteredIssues.map((issue) => (
                        <Link to={`/issues/${issue.id}`} key={issue.id} style={{ textDecoration: 'none' }}>
                            <div className="issue-card">
                                <div className="issue-header">
                                    <div>
                                        <h3 className="issue-title">{issue.title}</h3>
                                        <div className="issue-meta">
                                            <span className="badge" style={{
                                                background: 'var(--bg-glass)',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.7rem'
                                            }}>
                                                {issue.category}
                                            </span>
                                            <span>Reported by {issue.citizenName}</span>
                                            <span>•</span>
                                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`badge ${getStatusBadge(issue.status)}`}>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="issue-description">
                                    {issue.description.length > 200
                                        ? issue.description.substring(0, 200) + '...'
                                        : issue.description}
                                </p>
                                <div className="issue-footer">
                                    <div className="flex gap-md">
                                        <span className="text-muted">{issue.commentCount} comments</span>
                                        {issue.assignedPoliticianName && (
                                            <span className="text-muted">
                                                Assigned to: <strong>{issue.assignedPoliticianName}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">No issues found</h3>
                        <p className="empty-state-description">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No issues have been reported yet.'}
                        </p>
                        {user?.role === 'CITIZEN' && (
                            <Link to="/issues/create" className="btn btn-primary">
                                Report Your First Issue
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Issues;
