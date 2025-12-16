import { Globe } from 'lucide-react';

const About = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="page-title">About Neuroverse Galaxy</h1>

            <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Our beloved brother, <strong>Karuppusamy B</strong>, is a dedicated and hardworking student pursuing his final year of M.Sc. Software Systems at KG College of Arts and Science, Coimbatore. His dreams of building a brighter future through education have been suddenly interrupted by a life-threatening medical condition — <strong>end-stage kidney failure</strong>.
                </p>

                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Karuppusamy is now in urgent need of a kidney transplant to survive. Despite our family’s tireless efforts and financial sacrifices, the treatment expenses are far beyond our means. We have used up all our savings on his ongoing dialysis and medical care, but we still have a long way to go before we can afford the transplant and post-surgery recovery costs.
                </p>

                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Every contribution — no matter how small — brings us a step closer to saving his life. Your generosity can help us cover the hospitalization, surgery, medication, and recovery costs, giving Karuppusamy the chance to return to his studies and fulfill his dreams.
                </p>

                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    We understand the importance of transparency; we are ready to share medical reports, hospital estimates, and verification documents with anyone willing to help. From the bottom of our hearts, we thank you for your kindness, support, and prayers during this difficult time.
                </p>

                <div style={{ background: 'rgba(0, 243, 255, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--primary)', textAlign: 'center' }}>
                    <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Please consider donating</h3>
                    <a
                        href="https://milaap.org/fundraisers/support-Karuppusamy-B"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}
                    >
                        <Globe size={20} /> Donate via Milaap
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
