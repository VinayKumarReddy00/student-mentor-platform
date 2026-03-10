import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
            <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', marginBottom: '24px' }}>
                    <BookOpen size={40} color="var(--primary-color)" />
                </div>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    Student–Mentor <span className="text-gradient">Interactive Learning</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    Connect with industry professionals and top lecturers for structured roadmaps, interview prep, and doubt clarification.
                </p>
            </header>

            <div className="grid-cols-2 animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', gap: '40px', animationDelay: '0.2s' }}>
                
                {/* Student Card */}
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
                        <GraduationCap size={48} color="var(--secondary-color)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Student</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        Access structured learning roadmaps, get interview ready, and chat with mentors to clear your doubts.
                    </p>
                    <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: 'auto' }}
                        onClick={() => navigate('/auth/student')}
                    >
                        Join as Student <ArrowRight size={20} />
                    </button>
                </div>

                {/* Mentor Card */}
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '20px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
                        <Briefcase size={48} color="var(--primary-color)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Mentor</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        Share your expertise, rate learning materials, and guide the next generation of professionals.
                    </p>
                    <button 
                        className="btn btn-outline" 
                        style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: 'var(--border-radius-full)', border: '1px solid var(--primary-color)', color: 'var(--text-main)', transition: 'all var(--transition-normal)' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-glow)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        onClick={() => navigate('/auth/mentor')}
                    >
                        Join as Mentor <ArrowRight size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}
