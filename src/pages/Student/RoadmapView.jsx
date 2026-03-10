import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Star, Map as MapIcon, ChevronRight } from 'lucide-react';

export default function RoadmapView() {
    const { user, isSupabaseConfigured } = useAuth();
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    const courseName = user?.interested_course || 'General';

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setRoadmaps([
                { id: 1, title: `Beginner to Advanced ${courseName}`, content: '1. Basics of Application Architecture\n2. Advanced Patterns\n3. Interview Prep Foundations', rating: 4.8, rating_count: 12 },
                { id: 2, title: `${courseName} Crash Course`, content: 'Focus on core concepts and syntax.', rating: 4.2, rating_count: 5 },
            ]);
            setLoading(false);
            return;
        }

        const fetchRoadmaps = async () => {
            const { data, error } = await supabase
                .from('roadmaps')
                .select('*')
                .eq('course_name', courseName)
                .order('rating', { ascending: false });

            if (!error && data) {
                setRoadmaps(data);
            }
            setLoading(false);
        };

        fetchRoadmaps();
    }, [courseName, isSupabaseConfigured]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapIcon color="var(--primary-color)" /> {courseName} Roadmaps
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Structured learning paths crafted and rated by industry mentors.</p>
            </header>

            {loading ? (
                <div>Loading roadmaps...</div>
            ) : roadmaps.length === 0 ? (
                <div className="glass-panel flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>
                    No roadmaps available for {courseName} yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {roadmaps.map(roadmap => (
                        <div key={roadmap.id} className="glass-card" style={{ padding: '32px' }}>
                            <div className="flex-between" style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary-color)' }}>{roadmap.title}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 'var(--border-radius-full)' }}>
                                    <Star size={18} color="var(--warning-color)" fill="var(--warning-color)" />
                                    <span style={{ fontWeight: 'bold' }}>{Number(roadmap.rating).toFixed(1)}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({roadmap.rating_count} reviews)</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {roadmap.content.split('\n').map((step, idx) => step.trim() ? (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--border-radius-sm)' }}>
                                        <div style={{ marginTop: '2px', color: 'var(--primary-color)' }}><ChevronRight size={20} /></div>
                                        <div style={{ flex: 1, lineHeight: '1.6' }}>{step}</div>
                                    </div>
                                ) : null)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
