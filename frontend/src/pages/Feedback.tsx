import { useState } from 'react';
import { Star, Send } from 'lucide-react';

import axios from 'axios';

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [formData, setFormData] = useState({ name: '', comment: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback`, { ...formData, rating });
            alert('Thank you for your feedback!');
            setFormData({ name: '', comment: '' });
            setRating(0);
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="page-title">Share Your Experience</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rate Event/Stall</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    style={{ background: 'none', padding: 0 }}
                                >
                                    <Star
                                        size={32}
                                        fill={(hoveredRating || rating) >= star ? 'var(--warning)' : 'transparent'}
                                        color={(hoveredRating || rating) >= star ? 'var(--warning)' : 'var(--text-muted)'}
                                        style={{ transition: 'all 0.2s' }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Your Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Comments</label>
                        <textarea
                            rows={4}
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                            required
                            placeholder="What did you like? What can we improve?"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit Feedback <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
