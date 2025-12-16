import { useState, useEffect } from 'react';
import { User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Type definitions
type PackageType = 'BASIC' | 'PREMIUM';



interface PackageOption {
    id: string;
    title: string;
    type: PackageType;
    price: number;
    inclusions: string[];
    description?: string;
}

const packages: PackageOption[] = [
    // BASIC - INDIVIDUAL
    { id: 'basic-music', title: 'Music (Karaoke)', type: 'BASIC', price: 50, inclusions: ['1+1 Songs', 'Individual (2 songs) or Group (4 songs)'] },
    { id: 'basic-vr', title: 'VR Experience', type: 'BASIC', price: 75, inclusions: ['2 Plays', 'Immersive Experience'] },
    { id: 'basic-interaction', title: 'Interaction', type: 'BASIC', price: 50, inclusions: ['10 Minutes', 'AI/Talk Session'] },

    // BASIC - COMBO
    { id: 'basic-combo-music-vr', title: 'Music + VR', type: 'BASIC', price: 90, inclusions: ['Karaoke Session', 'VR Experience'] },
    { id: 'basic-combo-vr-inter', title: 'VR + Interaction', type: 'BASIC', price: 80, inclusions: ['VR Experience', '10 Min Interaction'] },
    { id: 'basic-combo-music-inter', title: 'Music + Interaction', type: 'BASIC', price: 75, inclusions: ['Karaoke Session', '10 Min Interaction'] },

    // BASIC - ALL IN ONE
    { id: 'basic-all', title: 'All-in-One Basic', type: 'BASIC', price: 130, inclusions: ['Music', 'VR', 'Interaction'], description: 'Best Value for Basic!' },

    // PREMIUM - INDIVIDUAL
    { id: 'premium-music', title: 'Music (Pro)', type: 'PREMIUM', price: 90, inclusions: ['3+1 Songs', 'Extended Session'] },
    { id: 'premium-vr', title: 'VR Experience (Pro)', type: 'PREMIUM', price: 130, inclusions: ['3 Plays', 'Extended Duration'] },
    { id: 'premium-interaction', title: 'Interaction (Pro)', type: 'PREMIUM', price: 80, inclusions: ['20 Minutes', 'Extended Session'] },

    // PREMIUM - COMBO
    { id: 'premium-combo-music-vr', title: 'Music + VR (Pro)', type: 'PREMIUM', price: 200, inclusions: ['Extended Music', 'Extended VR'] },
    { id: 'premium-combo-vr-inter', title: 'VR + Interaction (Pro)', type: 'PREMIUM', price: 180, inclusions: ['Extended VR', '20 Min Interaction'] },
    { id: 'premium-combo-music-inter', title: 'Music + Interaction (Pro)', type: 'PREMIUM', price: 150, inclusions: ['Extended Music', '20 Min Interaction'] },

    // PREMIUM - ALL IN ONE
    { id: 'premium-all', title: 'All-in-One Premium', type: 'PREMIUM', price: 275, inclusions: ['Extended Music', 'Extended VR', 'Extended Interaction'], description: 'Ultimate Experience!' },
];

const BookingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<PackageType>('BASIC');
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        studentClass: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const studentStr = localStorage.getItem('student');
        if (!studentStr) {
            alert('Please sign in to book a stall.');
            navigate('/login');
            return;
        }

        try {
            const student = JSON.parse(studentStr);
            setFormData(prev => ({
                ...prev,
                name: student.name || '',
                email: student.email || ''
            }));
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    }, [navigate]);

    const selectedPackage = packages.find(p => p.id === selectedPackageId);

    const handlePayment = async () => {
        if (!selectedPackage || !formData.name || !formData.email || !formData.phone || !formData.rollNo || !formData.studentClass) {
            alert('Please fill in all required details (including Roll No & Class) and select a package.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/registrations', {
                ...formData,
                stallId: selectedPackage.id,
                stallName: selectedPackage.title + ` (${selectedPackage.type})`,
                amount: selectedPackage.price
            });

            // Navigate to Payment Page
            navigate('/payment', {
                state: {
                    registration: {
                        id: res.data.registration.id,
                        stallName: selectedPackage.title + ` (${selectedPackage.type})`
                    },
                    amount: selectedPackage.price
                }
            });
        } catch (err) {
            console.error(err);
            alert('Registration failed. Contact admin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Book Your Stall</h1>
                <p style={{ color: '#ffd700', fontSize: '1.2rem', fontWeight: '500' }}>
                    All proceeds go towards supporting Karuppusamy B’s kidney transplant treatment.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Organized by KG Institutions | Developed by SinthanAi (AIML Dept)
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    onClick={() => setActiveTab('BASIC')}
                    style={{
                        padding: '1rem 3rem',
                        borderRadius: '2rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        border: '2px solid var(--primary)',
                        background: activeTab === 'BASIC' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'BASIC' ? '#000' : 'var(--primary)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    BASIC
                </button>
                <button
                    onClick={() => setActiveTab('PREMIUM')}
                    style={{
                        padding: '1rem 3rem',
                        borderRadius: '2rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        border: '2px solid var(--secondary)',
                        background: activeTab === 'PREMIUM' ? 'var(--secondary)' : 'transparent',
                        color: activeTab === 'PREMIUM' ? '#fff' : 'var(--secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    PREMIUM
                </button>
            </div>

            {/* Packages Grid */}
            <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {packages.filter(p => p.type === activeTab).map(pkg => (
                    <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        style={{
                            background: selectedPackageId === pkg.id
                                ? (activeTab === 'BASIC' ? 'rgba(0, 243, 255, 0.15)' : 'rgba(188, 19, 254, 0.15)')
                                : 'rgba(255, 255, 255, 0.03)',
                            border: selectedPackageId === pkg.id
                                ? `2px solid ${activeTab === 'BASIC' ? 'var(--primary)' : 'var(--secondary)'}`
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s',
                            transform: selectedPackageId === pkg.id ? 'translateY(-5px)' : 'none'
                        }}
                    >
                        {selectedPackageId === pkg.id && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', color: activeTab === 'BASIC' ? 'var(--primary)' : 'var(--secondary)' }}>
                                <CheckCircle size={24} fill={activeTab === 'BASIC' ? 'var(--primary)' : 'var(--secondary)'} color="#000" />
                            </div>
                        )}

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', paddingRight: '2rem' }}>{pkg.title}</h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: activeTab === 'BASIC' ? '#00f3ff' : '#bc13fe' }}>
                            ₹{pkg.price}
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {pkg.inclusions.map((inc, i) => (
                                <li key={i} style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    • {inc}
                                </li>
                            ))}
                        </ul>
                        {pkg.description && (
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem', fontStyle: 'italic', color: '#ffd700' }}>
                                {pkg.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* User Details & Checkout */}
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User /> Checkout Details
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="grid-2">
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name *</label>
                            <input
                                type="text"
                                placeholder="Name"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Roll No *</label>
                            <input
                                type="text"
                                placeholder="Roll Number"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                value={formData.rollNo}
                                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Class / Department *</label>
                            <input
                                type="text"
                                placeholder="e.g. 2nd MSc SS"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                value={formData.studentClass}
                                onChange={e => setFormData({ ...formData, studentClass: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>College Email Address *</label>
                            <input
                                type="email"
                                placeholder="student@kgcas.com"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Phone"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes (Optional)</label>
                            <textarea
                                placeholder="Any special requests..."
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', minHeight: '80px' }}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            Total to Pay: <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>₹{selectedPackage ? selectedPackage.price : 0}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={!selectedPackage || loading}
                            className="btn"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '1rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                background: activeTab === 'BASIC' ? 'var(--primary)' : 'var(--secondary)',
                                color: activeTab === 'BASIC' ? '#000' : '#fff',
                                border: 'none',
                                opacity: (!selectedPackage || loading) ? 0.5 : 1,
                                cursor: (!selectedPackage || loading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Processing...' : `Book Now (₹${selectedPackage ? selectedPackage.price : 0})`}
                        </button>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            This is a charity event. Your contribution supports the medical treatment of our student, <strong>Karuppusamy B</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
