import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Map, HelpCircle, LogOut, Briefcase, Building } from 'lucide-react';

import MentorChatView from './MentorChatView';
import MentorRoadmapView from './MentorRoadmapView';
import MentorInterviewPrepView from './MentorInterviewPrepView';
import CompanyInsightsView from '../Shared/CompanyInsightsView';

export default function MentorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { path: '/mentor/dashboard', label: 'Student Chat', icon: <MessageSquare size={20} /> },
        { path: '/mentor/roadmaps', label: 'Rate Roadmaps', icon: <Map size={20} /> },
        { path: '/mentor/interview-prep', label: 'Rate Q&A', icon: <HelpCircle size={20} /> },
        { path: '/mentor/insights', label: 'Company Insights', icon: <Building size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'rgba(255, 255, 255, 0.02)', borderRight: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Mentor Portal</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={20} color="white" />
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.full_name}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.course_expertise || 'No expertise set'}</p>
                        </div>
                    </div>
                </div>

                <nav style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path === '/mentor/dashboard' && location.pathname === '/mentor');
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                                    borderRadius: 'var(--border-radius-sm)',
                                    background: isActive ? 'var(--primary-glow)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--text-muted)',
                                    borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                {item.icon} {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger-color)', width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)' }} className="btn-outline">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto', height: '100vh', position: 'relative' }}>
                <Routes>
                    <Route path="/" element={<MentorChatView />} />
                    <Route path="/dashboard" element={<MentorChatView />} />
                    <Route path="/roadmaps" element={<MentorRoadmapView />} />
                    <Route path="/interview-prep" element={<MentorInterviewPrepView />} />
                    <Route path="/insights" element={<CompanyInsightsView />} />
                </Routes>
            </main>
        </div>
    );
}
