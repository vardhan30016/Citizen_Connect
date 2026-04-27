import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUpdate } from '../store/slices/updateSlice';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

function CreateUpdate() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        published: true
    });
    const [loading, setLoading] = useState(false);

    const categories = [
        'Announcement',
        'Event',
        'Policy',
        'Initiative',
        'Report',
        'Community',
        'Other'
    ];

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await dispatch(createUpdate(formData)).unwrap();
            toast.success('Update posted successfully!');
            navigate('/updates');
        } catch (error) {
            toast.error(error || 'Failed to post update');
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
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Post an Update</h1>
                <p className="text-muted mb-lg">
                    Share news, announcements, or updates with citizens in your constituency.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Title for your update"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            minLength={5}
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content *</label>
                        <textarea
                            name="content"
                            className="form-textarea"
                            placeholder="Write your update content here..."
                            value={formData.content}
                            onChange={handleChange}
                            required
                            minLength={20}
                            style={{ minHeight: '200px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                            />
                            <span>Publish immediately</span>
                        </label>
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
                            {loading ? 'Posting...' : (
                                <>
                                    <FiSend /> Post Update
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUpdate;
