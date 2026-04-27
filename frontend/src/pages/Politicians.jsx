import { useState, useEffect } from 'react';
import { userAPI, feedbackAPI } from '../api/api';
import { FiStar, FiMapPin, FiMail } from 'react-icons/fi';

function Politicians() {
    const [politicians, setPoliticians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await userAPI.getPoliticians();
                const pols = res.data.data;
                setPoliticians(pols);

                // Fetch ratings for each politician
                const ratingPromises = pols.map(async (pol) => {
                    try {
                        const ratingRes = await feedbackAPI.getAverageRating(pol.id);
                        return { id: pol.id, rating: ratingRes.data.data };
                    } catch {
                        return { id: pol.id, rating: 0 };
                    }
                });

                const ratingResults = await Promise.all(ratingPromises);
                const ratingMap = {};
                ratingResults.forEach((r) => {
                    ratingMap[r.id] = r.rating;
                });
                setRatings(ratingMap);
            } catch (error) {
                console.error('Failed to fetch politicians');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const getInitials = (name) => {
        if (!name) return 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Your Representatives</h1>
                <p className="page-description">
                    View and connect with politicians in your area.
                </p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : politicians.length > 0 ? (
                <div className="politicians-grid">
                    {politicians.map((politician) => (
                        <div key={politician.id} className="politician-card">
                            <div className="politician-avatar">
                                {getInitials(politician.fullName)}
                            </div>

                            <h3 className="politician-name">
                                {politician.fullName}
                            </h3>

                            <span className="badge badge-politician">Politician</span>

                            <div className="rating" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                                {renderStars(Math.round(ratings[politician.id] || 0))}
                                <span className="rating-value">
                                    ({ratings[politician.id]?.toFixed(1) || '0.0'})
                                </span>
                            </div>

                            <div className="politician-info">
                                {politician.constituency && (
                                    <p className="politician-detail">
                                        <FiMapPin /> {politician.constituency}
                                    </p>
                                )}

                                {politician.email && (
                                    <p className="politician-detail">
                                        <FiMail /> {politician.email}
                                    </p>
                                )}
                            </div>

                            <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h3 className="empty-state-title">No politicians registered</h3>
                        <p className="empty-state-description">
                            No politicians have been registered on the platform yet.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Politicians;
