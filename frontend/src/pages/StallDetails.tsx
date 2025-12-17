import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stalls } from '../data/stalls';
import { User, CheckCircle } from 'lucide-react';
import axios from 'axios';

const StallDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const stall = stalls.find(s => s.id === id);

    // Filter packages relevant to this stall
    // const stallKeyword = stall?.label.split(' ')[0].toLowerCase(); // Unused

    // Manual mapping for keywords
    let keyword = '';
    if (id === 'stall-1') keyword = 'music';
    if (id === 'stall-2') keyword = 'vr';
    if (id === 'stall-3') keyword = 'interaction';

    // Import packages data (moved from BookingPage)
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

    const allPackages: PackageOption[] = [
        // ECHO MANDALAM (MUSIC) PACKAGES
        { id: 'music-karaoke-indiv', title: 'Karaoke (2 Persons)', type: 'BASIC', price: 50, inclusions: ['2 Songs Each', 'Photos'] },
        { id: 'music-karaoke-group4', title: 'Karaoke (Group of 4)', type: 'PREMIUM', price: 100, inclusions: ['3 Songs', 'Photos', 'Game Included'] },
        { id: 'music-karaoke-group6', title: 'Karaoke (Group of 6)', type: 'PREMIUM', price: 120, inclusions: ['4 Songs', 'Photos', 'Game Included'] },
        { id: 'music-overall-tour', title: 'Overall Echo Mandalam Tour', type: 'PREMIUM', price: 50, inclusions: ['Full Tour', 'Free VR Experience'] },
        { id: 'music-5-games', title: '5 Games Challenge', type: 'BASIC', price: 50, inclusions: ['5 Games', 'Win = Free VR'] },
        { id: 'music-single-game', title: 'Single Game', type: 'BASIC', price: 10, inclusions: ['1 Game'] },
        { id: 'music-instruments-ai', title: 'Instruments AI', type: 'BASIC', price: 20, inclusions: ['AI Instruments', '1 Game Free'] },

        // COSMIC MANDALAM (VR) PACKAGES
        {
            id: 'vr-experience-single',
            title: 'VR Experience (4 Mins)',
            type: 'PREMIUM',
            price: 50,
            inclusions: ['Choose your world at stall', '4 Minutes Duration'],
            description: 'Experience one of our thrilling worlds!'
        },

        // INTERACTION PACKAGES (Stall 3)
        { id: 'basic-interaction', title: 'Interaction', type: 'BASIC', price: 50, inclusions: ['Unlimited with AI/Talk Session'] },

    ];

    const filteredPackages = allPackages.filter(p =>
        keyword && p.id.includes(keyword)
    );

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
        if (studentStr) {
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
        }
    }, []);

    if (!stall) return <div className="container">Stall not found</div>;

    const selectedPackage = allPackages.find(p => p.id === selectedPackageId);

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
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Stall Header */}
            <div style={{ marginBottom: '3rem' }}>
                <img
                    src={stall.image}
                    alt={stall.name}
                    style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)' }}
                />
                <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '1rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    {stall.label}
                    <span style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'normal', fontFamily: 'var(--font-main)' }}>// {stall.name}</span>
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{stall.fullDescription}</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Choose Your Experience</h2>

                {/* Cosmic Mandalam Themes Display */}
                {id === 'stall-2' && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--primary)' }}>Available Worlds</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                            {['Jurassic World', 'Hell', 'Horror', 'Under Water', 'Space'].map((theme, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--primary)',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>
                                    {theme}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {filteredPackages.map(pkg => (
                        <div
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            style={{
                                background: selectedPackageId === pkg.id
                                    ? (pkg.type === 'BASIC' ? 'rgba(0, 243, 255, 0.15)' : 'rgba(188, 19, 254, 0.15)')
                                    : 'rgba(255, 255, 255, 0.03)',
                                border: selectedPackageId === pkg.id
                                    ? `2px solid ${pkg.type === 'BASIC' ? 'var(--primary)' : 'var(--secondary)'}`
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
                                <div style={{ position: 'absolute', top: '10px', right: '10px', color: pkg.type === 'BASIC' ? 'var(--primary)' : 'var(--secondary)' }}>
                                    <CheckCircle size={24} fill={pkg.type === 'BASIC' ? 'var(--primary)' : 'var(--secondary)'} color="#000" />
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', paddingRight: '2rem' }}>{pkg.title}</h3>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: pkg.type === 'BASIC' ? '#00f3ff' : '#bc13fe' }}>
                                ₹{pkg.price}
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {pkg.inclusions.map((inc, i) => (
                                    <li key={i} style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        • {inc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* User Details & Checkout */}
                <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    background: selectedPackage?.type === 'BASIC' ? 'var(--primary)' : 'var(--secondary)',
                                    color: selectedPackage?.type === 'BASIC' ? '#000' : '#fff',
                                    border: 'none',
                                    opacity: (!selectedPackage || loading) ? 0.5 : 1,
                                    cursor: (!selectedPackage || loading) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Processing...' : `Book Now (₹${selectedPackage ? selectedPackage.price : 0})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StallDetails;
