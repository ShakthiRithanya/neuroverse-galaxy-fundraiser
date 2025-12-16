import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stalls } from './Home';
import { CreditCard, User, Mail, Phone } from 'lucide-react';
import axios from 'axios';

// Define the Razorpay global
declare global {
    interface Window {
        Razorpay: any;
    }
}

const StallDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const stall = stalls.find(s => s.id === id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    if (!stall) return <div className="container">Stall not found</div>;

    const handlePayment = async (order: any, registrationId: string) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: order.amount,
            currency: order.currency,
            name: "Neuroverse Galaxy",
            description: `Payment for ${stall.name}`,
            order_id: order.id,
            handler: async function (response: any) {
                try {
                    setLoading(true);
                    await axios.post('http://localhost:5000/api/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        registrationId: registrationId
                    });
                    alert('Payment Successful! Your registration is confirmed.');
                    navigate('/');
                } catch (error) {
                    console.error("Payment verification failed", error);
                    alert('Payment verification failed. Please contact support.');
                } finally {
                    setLoading(false);
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#00f3ff"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
            alert(response.error.description);
            setLoading(false);
        });
        rzp1.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Order & Registration
            const res = await axios.post('http://localhost:5000/api/registrations', {
                ...formData,
                stallId: id,
                stallName: stall.name
            });

            const { order, registration } = res.data;

            // 2. Open Razorpay
            await handlePayment(order, registration.id);

        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <img
                    src={stall.image}
                    alt={stall.name}
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--primary)' }}
                />
                <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    {stall.name}
                    <span style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'normal', fontFamily: 'var(--font-main)' }}>// {stall.label}</span>
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{stall.fullDescription}</p>
            </div>

            <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard className="text-primary" /> Register & Pay
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="john@college.edu"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="tel"
                                placeholder="+1 234 567 890"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Proceed to Payment (₹100)'}
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        * Secured by Razorpay
                    </p>
                </form>
            </div>
        </div>
    );
};

export default StallDetails;
