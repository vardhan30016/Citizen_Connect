import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userAPI, feedbackAPI } from '../api/api';
import { toast } from 'react-toastify';
import { FiStar, FiSend } from 'react-icons/fi';

function Feedback() {
    const { user } = useSelector((state) => state.auth);
    const [politicians, setPoliticians] = useState([]);
    const [myFeedback, setMyFeedback] = useState([]);
    const [selectedPolitician, setSelectedPolitician] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Responsiveness', 'Effectiveness', 'Communication', 'Transparency', 'Overall'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [polRes, feedbackRes] = await Promise.all([
                    userAPI.getPoliticians(),
                    feedbackAPI.getMyFeedback()
                ]);
                setPoliticians(polRes.data.data);
                setMyFeedback(feedbackRes.data.data);
            } catch (error) {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPolitician || !rating) {
            toast.error('Please select a politician and rating');
            return;
        }

        setLoading(true);
        try {
            const res = await feedbackAPI.submit({
                politicianId: parseInt(selectedPolitician),
                rating,
                comment,
                category
            });
            setMyFeedback([res.data.data, ...myFeedback]);
            setSelectedPolitician('');
            setRating(0);
            setComment('');
            setCategory('');
            toast.success('Feedback submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (currentRating, interactive = false) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= (interactive ? (hoverRating || rating) : currentRating) ? 'filled' : ''}`}
                style={{ cursor: interactive ? 'pointer' : 'default', fontSize: interactive ? '2rem' : '1rem' }}
                onClick={interactive ? () => setRating(star) : undefined}
                onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Feedback</h1>
                <p className="page-description">
                    Rate and provide feedback on your elected representatives.
                </p>
            </div>

            <div className="dashboard-grid">
                {/* Submit Feedback Form */}
                <div className="col-6">
                    <div className="card">
                        <h2 className="card-title mb-lg">Submit Feedback</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Politician *</label>
                                <select
                                    className="form-select"
                                    value={selectedPolitician}
                                    onChange={(e) => setSelectedPolitician(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a politician</option>
                                    {politicians.map((pol) => (
                                        <option key={pol.id} value={pol.id}>
                                            {pol.fullName} {pol.constituency && `(${pol.constituency})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rating *</label>
                                <div className="rating" style={{ marginTop: '0.5rem' }}>
                                    {renderStars(rating, true)}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Comments</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Share your thoughts..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        <FiSend /> Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Feedback History */}
                <div className="col-6">
                    <div className="card">
                        <h2 className="card-title mb-lg">My Feedback History</h2>

                        {myFeedback.length > 0 ? (
                            <div>
                                {myFeedback.map((fb) => (
                                    <div key={fb.id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <div className="flex-between mb-sm">
                                            <strong>{fb.politicianName}</strong>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {new Date(fb.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="rating mb-sm">
                                            {renderStars(fb.rating)}
                                        </div>
                                        {fb.category && (
                                            <span className="badge mb-sm" style={{
                                                background: 'var(--bg-glass)',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.7rem'
                                            }}>
                                                {fb.category}
                                            </span>
                                        )}
                                        {fb.comment && (
                                            <p className="text-muted mt-sm" style={{ fontSize: '0.875rem' }}>
                                                "{fb.comment}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p className="text-muted">You haven't submitted any feedback yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
