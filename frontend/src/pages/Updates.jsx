import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUpdates } from '../store/slices/updateSlice';
import { FiPlus, FiEye, FiCalendar } from 'react-icons/fi';

function Updates() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { updates, loading } = useSelector((state) => state.updates);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUpdates());
    }, [dispatch]);

    return (
        <div className="page-container">
            <div className="page-header flex-between">
                <div>
                    <h1 className="page-title">Updates & Announcements</h1>
                    <p className="page-description">
                        Stay informed with the latest updates from your elected representatives.
                    </p>
                </div>
                {isAuthenticated && user?.role === 'POLITICIAN' && (
                    <Link to="/updates/create" className="btn btn-primary">
                        <FiPlus /> Post Update
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : updates.length > 0 ? (
                <div className="dashboard-grid">
                    {updates.map((update) => (
                        <div key={update.id} className="col-6">
                            <div className="card" style={{ height: '100%' }}>
                                {update.imageUrl && (
                                    <img
                                        src={update.imageUrl}
                                        alt={update.title}
                                        style={{
                                            width: '100%',
                                            height: '180px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                )}
                                <div className="flex-between mb-sm">
                                    <span className="badge" style={{
                                        background: 'var(--bg-glass)',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {update.category || 'Announcement'}
                                    </span>
                                    <div className="flex gap-sm text-muted" style={{ fontSize: '0.75rem' }}>
                                        <span><FiEye /> {update.viewCount || 0}</span>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                    {update.title}
                                </h3>
                                <p className="text-muted mb-md" style={{ fontSize: '0.875rem' }}>
                                    By <strong>{update.politicianName}</strong>
                                </p>
                                <p className="text-muted" style={{
                                    lineHeight: 1.7,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {update.content}
                                </p>
                                <div className="mt-md text-muted" style={{ fontSize: '0.75rem' }}>
                                    <FiCalendar style={{ marginRight: '0.25rem' }} />
                                    {new Date(update.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📢</div>
                        <h3 className="empty-state-title">No updates yet</h3>
                        <p className="empty-state-description">
                            Politicians haven't posted any updates yet. Check back later!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Updates;
