import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { registration, amount } = location.state || {}; // Expecting registration object and amount

    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'GPAY' | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (!registration?.id) return;

        // Poll for status
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/registrations/${registration.id}`);
                if (res.data.paymentStatus === 'Paid') {
                    setShowSuccessModal(true);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [registration]);

    if (!registration) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>No booking found.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '2rem auto', position: 'relative' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Payment Options</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Complete your booking for <strong>{registration.stallName}</strong>
                </p>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total Amount</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{amount}</div>
                </div>

                {/* Selection Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div
                        onClick={() => setPaymentMethod('CASH')}
                        style={{
                            padding: '1.5rem',
                            border: `2px solid ${paymentMethod === 'CASH' ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: '1rem',
                            background: paymentMethod === 'CASH' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Banknote size={32} color={paymentMethod === 'CASH' ? 'var(--primary)' : '#fff'} />
                        <span style={{ fontWeight: 600 }}>Cash</span>
                    </div>

                    <div
                        onClick={() => setPaymentMethod('GPAY')}
                        style={{
                            padding: '1.5rem',
                            border: `2px solid ${paymentMethod === 'GPAY' ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: '1rem',
                            background: paymentMethod === 'GPAY' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <CreditCard size={32} color={paymentMethod === 'GPAY' ? 'var(--primary)' : '#fff'} />
                        <span style={{ fontWeight: 600 }}>Google Pay</span>
                    </div>
                </div>

                {/* Content based on selection */}
                {paymentMethod === 'CASH' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                        <CheckCircle size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Pay at Counter</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Please pay <strong>₹{amount}</strong> in cash at the event counter.
                            <br />
                            Show your Name/Email to the volunteer.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                            <Loader size={20} className="spin" /> Waiting for confirmation...
                        </div>
                    </div>
                )}

                {paymentMethod === 'GPAY' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Scan to Pay</h3>
                        <div style={{ background: '#fff', padding: '1rem', display: 'inline-block', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                            <img src="/payment_qr.jpg" alt="Payment QR Code" style={{ width: '200px', height: 'auto', display: 'block' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Scan to pay with any UPI app
                        </p>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>Nirmaladevi J</div>
                            <div style={{ fontFamily: 'monospace' }}>jvandana25-1@okaxis</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                            <Loader size={20} className="spin" /> Waiting for admin approval...
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="animate-scale-in" style={{
                        background: 'var(--background)',
                        border: '2px solid var(--success)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        textAlign: 'center',
                        maxWidth: '90%',
                        width: '400px',
                        boxShadow: '0 0 50px rgba(0, 255, 0, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Payment Successful!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Your booking has been approved by the admin.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleClose}>
                            Continue to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
