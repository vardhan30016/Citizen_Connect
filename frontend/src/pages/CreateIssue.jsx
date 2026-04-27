import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createIssue } from '../store/slices/issueSlice';
import { userAPI } from '../api/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

function CreateIssue() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        assignedPoliticianId: ''
    });
    const [politicians, setPoliticians] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPoliticians = async () => {
            try {
                const res = await userAPI.getPoliticians();
                setPoliticians(res.data.data);
            } catch (error) {
                console.error('Failed to fetch politicians');
            }
        };
        fetchPoliticians();
    }, []);

    const categories = [
        'Infrastructure',
        'Public Safety',
        'Healthcare',
        'Education',
        'Environment',
        'Transportation',
        'Housing',
        'Employment',
        'Utilities',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                assignedPoliticianId: formData.assignedPoliticianId || null
            };
            await dispatch(createIssue(payload)).unwrap();
            toast.success('Issue reported successfully!');
            navigate('/issues');
        } catch (error) {
            toast.error(error || 'Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary mb-lg"
            >
                <FiArrowLeft /> Back
            </button>

            <div className="card">
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Report an Issue</h1>
                <p className="text-muted mb-lg">
                    Describe the issue you want to report to your representative.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Issue Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Brief title for your issue"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            minLength={5}
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            placeholder="Provide detailed description of the issue..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            minLength={20}
                            style={{ minHeight: '150px' }}
                        />
                        <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
                            Minimum 20 characters. Be as detailed as possible.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-input"
                            placeholder="Specific location or area (optional)"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Assign to Politician</label>
                        <select
                            name="assignedPoliticianId"
                            className="form-select"
                            value={formData.assignedPoliticianId}
                            onChange={handleChange}
                        >
                            <option value="">Select a politician (optional)</option>
                            {politicians.map((pol) => (
                                <option key={pol.id} value={pol.id}>
                                    {pol.fullName} {pol.constituency && `(${pol.constituency})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-md mt-lg">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FiSend /> Submit Issue
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateIssue;
