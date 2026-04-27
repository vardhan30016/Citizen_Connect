import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { issueAPI, commentAPI } from '../api/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

function IssueDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssueDetails();
    }, [id]);

    const fetchIssueDetails = async () => {
        try {
            const [issueRes, commentsRes] = await Promise.all([
                issueAPI.getById(id),
                commentAPI.getByIssue(id)
            ]);
            setIssue(issueRes.data.data);
            setComments(commentsRes.data.data);
        } catch (error) {
            toast.error('Failed to load issue details');
            navigate('/issues');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await commentAPI.add(id, newComment);
            setComments([...comments, res.data.data]);
            setNewComment('');
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleRespond = async () => {
        if (!response.trim()) return;

        try {
            const res = await issueAPI.respond(id, response);
            setIssue(res.data.data);
            setResponse('');
            toast.success('Response submitted');
        } catch (error) {
            toast.error('Failed to submit response');
        }
    };

    const handleResolve = async () => {
        try {
            const resolutionNotes = prompt('Enter resolution notes:');
            if (resolutionNotes === null) return;

            const res = await issueAPI.resolve(id, resolutionNotes);
            setIssue(res.data.data);
            toast.success('Issue marked as resolved');
        } catch (error) {
            toast.error('Failed to resolve issue');
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

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!issue) return null;

    const isPoliticianAssigned = user?.role === 'POLITICIAN' &&
        issue.assignedPoliticianId === user.id;

    return (
        <div className="page-container">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary mb-lg"
            >
                <FiArrowLeft /> Back
            </button>

            <div className="dashboard-grid">
                {/* Main Content */}
                <div className="col-8">
                    <div className="card">
                        <div className="flex-between mb-lg">
                            <span className={`badge ${getStatusBadge(issue.status)}`}>
                                {issue.status.replace('_', ' ')}
                            </span>
                            <span className="text-muted">
                                {new Date(issue.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                            {issue.title}
                        </h1>

                        <div className="flex gap-md mb-lg text-muted" style={{ fontSize: '0.875rem' }}>
                            <span><strong>Category:</strong> {issue.category}</span>
                            {issue.location && <span><strong>Location:</strong> {issue.location}</span>}
                            <span><strong>Reported by:</strong> {issue.citizenName}</span>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                {issue.description}
                            </p>
                        </div>

                        {/* Politician Response */}
                        {issue.response && (
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                borderLeft: '4px solid var(--primary-500)',
                                marginBottom: '1.5rem'
                            }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Official Response</h4>
                                <p style={{ lineHeight: 1.7 }}>{issue.response}</p>
                            </div>
                        )}

                        {/* Resolution Notes */}
                        {issue.resolutionNotes && (
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                borderLeft: '4px solid var(--accent-emerald)'
                            }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Resolution Notes</h4>
                                <p style={{ lineHeight: 1.7 }}>{issue.resolutionNotes}</p>
                            </div>
                        )}

                        {/* Politician Actions */}
                        {isPoliticianAssigned && issue.status !== 'RESOLVED' && issue.status !== 'CLOSED' && (
                            <div className="card mt-lg" style={{ background: 'var(--bg-tertiary)' }}>
                                <h3 className="mb-md">Respond to this Issue</h3>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Write your response..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />
                                <div className="flex gap-md mt-md">
                                    <button onClick={handleRespond} className="btn btn-primary">
                                        <FiSend /> Submit Response
                                    </button>
                                    <button onClick={handleResolve} className="btn btn-success">
                                        <FiCheckCircle /> Mark as Resolved
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="card mt-lg">
                        <h3 className="mb-lg">
                            <FiMessageSquare style={{ marginRight: '0.5rem' }} />
                            Comments ({comments.length})
                        </h3>

                        {comments.length > 0 ? (
                            <div>
                                {comments.map((comment) => (
                                    <div key={comment.id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <div className="flex-between mb-sm">
                                            <div className="flex gap-sm">
                                                <strong>{comment.userName}</strong>
                                                <span className={`badge badge-${comment.userRole.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                                                    {comment.userRole}
                                                </span>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p>{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No comments yet. Be the first to comment!</p>
                        )}

                        {/* Add Comment */}
                        <div className="mt-lg flex gap-md">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                style={{ flex: 1 }}
                            />
                            <button onClick={handleAddComment} className="btn btn-primary">
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-4">
                    <div className="card">
                        <h3 className="mb-lg">Issue Details</h3>
                        <div style={{ fontSize: '0.875rem' }}>
                            <div className="mb-md">
                                <strong className="text-muted">Status</strong>
                                <p className={`badge ${getStatusBadge(issue.status)} mt-sm`}>
                                    {issue.status.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="mb-md">
                                <strong className="text-muted">Assigned To</strong>
                                <p className="mt-sm">
                                    {issue.assignedPoliticianName || 'Not assigned yet'}
                                </p>
                            </div>
                            <div className="mb-md">
                                <strong className="text-muted">Created</strong>
                                <p className="mt-sm">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {issue.resolvedAt && (
                                <div className="mb-md">
                                    <strong className="text-muted">Resolved</strong>
                                    <p className="mt-sm">
                                        {new Date(issue.resolvedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueDetail;
