import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

export default function CompanyInsightsView() {
    const { user } = useAuth();

    // Support both Student (interested_course) and Mentor (course_expertise) views
    const courseFocus = user?.interested_course || user?.course_expertise || 'General';

    // A utility to dynamically map common high-end job titles based on exactly what course the user chose
    const getHighPayingRole = (course) => {
        const lower = course.toLowerCase();
        if (lower.includes('java')) return 'Staff Backend Systems Engineer';
        if (lower.includes('python')) return 'Machine Learning Engineer';
        if (lower.includes('ethic') || lower.includes('hack') || lower.includes('security')) return 'Lead Penetration Tester';
        if (lower.includes('web') || lower.includes('react') || lower.includes('frontend')) return 'Principal Frontend Architect';
        if (lower.includes('data')) return 'Senior Data Scientist';
        if (lower.includes('cloud') || lower.includes('aws')) return 'Cloud Infrastructure Architect';
        return `Senior Enterprise ${course} Engineer`;
    };

    const targetRole = getHighPayingRole(courseFocus);

    const companies = [
        {
            name: 'Google',
            logoAlt: 'G',
            color: '#4285F4',
            role: targetRole,
            salary: '$180,000 - $350,000+',
            perks: 'Free meals, 401k match, High equity grants.'
        },
        {
            name: 'Microsoft',
            logoAlt: 'M',
            color: '#00A4EF',
            role: targetRole,
            salary: '$160,000 - $300,000+',
            perks: 'Excellent work-life balance, Top tier healthcare.'
        },
        {
            name: 'Meta',
            logoAlt: 'Me',
            color: '#0668E1',
            role: targetRole,
            salary: '$200,000 - $400,000+',
            perks: 'Aggressive stock vesting, Fast promotions.'
        },
        {
            name: 'Amazon',
            logoAlt: 'A',
            color: '#FF9900',
            role: targetRole,
            salary: '$170,000 - $320,000+',
            perks: 'Remote flexibility, Massive scale architecture.'
        },
        {
            name: 'Apple',
            logoAlt: 'Ap',
            color: '#A2AAAD',
            role: targetRole,
            salary: '$180,000 - $330,000+',
            perks: 'Hardware discounts, Exclusive campus resources.'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Building color="var(--primary-color)" /> Tech Industry Insights
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Discover high-paying careers in <strong style={{ color: 'var(--primary-color)' }}>{courseFocus}</strong> at top multi-national companies.</p>
            </header>

            <div className="grid-cols-2" style={{ gap: '24px' }}>
                {companies.map((company) => (
                    <div key={company.name} className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                        {/* Decorative Background Blob */}
                        <div style={{
                            position: 'absolute',
                            top: '-40px',
                            right: '-40px',
                            width: '120px',
                            height: '120px',
                            background: company.color,
                            opacity: 0.1,
                            borderRadius: '50%',
                            filter: 'blur(30px)'
                        }} />

                        <div className="flex-between" style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: company.color,
                                    fontSize: '1.5rem',
                                    fontWeight: '900',
                                    border: `1px solid ${company.color}40`,
                                    boxShadow: `0 0 20px ${company.color}20`
                                }}>
                                    {company.logoAlt}
                                </div>
                                <h2 style={{ fontSize: '1.6rem', color: 'white', fontWeight: 'bold' }}>{company.name}</h2>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-color)', fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                                <TrendingUp size={16} /> Hot Market
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1, marginTop: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Briefcase size={20} color="var(--primary-color)" style={{ marginTop: '2px' }} />
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Target Elite Role</h3>
                                    <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>{company.role}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <DollarSign size={20} color="var(--success-color)" style={{ marginTop: '2px' }} />
                                <div>
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Estimated Total Compensation</h3>
                                    <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--success-color)' }}>{company.salary}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '12px',
                            borderLeft: `4px solid ${company.color}`,
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                <strong style={{ color: 'white' }}>Known For:</strong> {company.perks}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
