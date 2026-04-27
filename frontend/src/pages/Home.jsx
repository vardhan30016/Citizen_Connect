import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiMessageSquare, FiBell, FiCheckCircle, FiUsers } from 'react-icons/fi';

function Home() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    const features = [
        {
            icon: <FiMessageSquare />,
            title: 'Report Issues',
            description: 'Easily report problems in your constituency and track their resolution status.',
            color: 'cyan'
        },
        {
            icon: <FiBell />,
            title: 'Stay Updated',
            description: 'Receive real-time updates and announcements from your elected representatives.',
            color: 'primary'
        },
        {
            icon: <FiCheckCircle />,
            title: 'Give Feedback',
            description: 'Rate and review politician performance to help improve governance.',
            color: 'emerald'
        },
        {
            icon: <FiUsers />,
            title: 'Engage in Discussions',
            description: 'Participate in community discussions about local issues and policies.',
            color: 'amber'
        }
    ];

    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">
                    Connect with Your Representatives
                </h1>
                <p className="hero-subtitle">
                    CitizenConnect is a platform that bridges the gap between citizens and politicians.
                    Report issues, receive updates, and make your voice heard in local governance.
                </p>
                <div className="hero-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard <FiArrowRight />
                            </Link>
                            <Link to="/issues/create" className="btn btn-secondary btn-lg">
                                Report an Issue
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started <FiArrowRight />
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="stats-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className={`stat-icon ${feature.color}`}>
                            {feature.icon}
                        </div>
                        <h3 className="card-title">{feature.title}</h3>
                        <p className="text-muted mt-sm">{feature.description}</p>
                    </div>
                ))}
            </section>

            {/* Stats Section */}
            <section className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Trusted by Citizens Across the Nation</h2>
                <div className="stats-grid">
                    <div>
                        <div className="stat-value">10,000+</div>
                        <div className="stat-label">Active Citizens</div>
                    </div>
                    <div>
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Politicians</div>
                    </div>
                    <div>
                        <div className="stat-value">25,000+</div>
                        <div className="stat-label">Issues Resolved</div>
                    </div>
                    <div>
                        <div className="stat-value">98%</div>
                        <div className="stat-label">Satisfaction Rate</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
