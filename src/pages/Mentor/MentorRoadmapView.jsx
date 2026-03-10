import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Star, Map as MapIcon, Plus, ChevronRight } from 'lucide-react';

export default function MentorRoadmapView() {
    const { user, isSupabaseConfigured } = useAuth();
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add new roadmap state
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const courseName = user?.course_expertise || 'General';

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setRoadmaps([
                { id: 1, title: `Beginner to Advanced ${courseName}`, content: '1. Basics of Application Architecture\n2. Advanced Patterns\n3. Interview Prep Foundations', rating: 4.8, rating_count: 12 },
                { id: 2, title: `${courseName} Crash Course`, content: 'Focus on core concepts and syntax.', rating: 4.2, rating_count: 5 },
            ]);
            setLoading(false);
            return;
        }

        fetchRoadmaps();
    }, [courseName, isSupabaseConfigured]);

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

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        if (!isSupabaseConfigured) {
            setRoadmaps(prev => [{
                id: Date.now(),
                title: newTitle,
                content: newContent,
                rating: 0,
                rating_count: 0
            }, ...prev]);
            setShowForm(false);
            setNewTitle('');
            setNewContent('');
            return;
        }

        const { error } = await supabase.from('roadmaps').insert([{
            course_name: courseName,
            title: newTitle,
            content: newContent,
            created_by: user.id
        }]);

        if (!error) {
            setShowForm(false);
            setNewTitle('');
            setNewContent('');
            fetchRoadmaps();
        }
    };

    const handleRate = async (roadmapId, currentRating, currentCount, newRateScore) => {
        if (!isSupabaseConfigured) {
            setRoadmaps(prev => prev.map(r => {
                if(r.id === roadmapId) {
                    const totalScore = (r.rating * r.rating_count) + newRateScore;
                    const newCount = r.rating_count + 1;
                    return { ...r, rating: totalScore / newCount, rating_count: newCount };
                }
                return r;
            }));
            return;
        }

        const totalScore = (currentRating * currentCount) + newRateScore;
        const newCount = currentCount + 1;
        const newAverage = totalScore / newCount;

        await supabase.from('roadmaps')
            .update({ rating: newAverage, rating_count: newCount })
            .eq('id', roadmapId);
            
        fetchRoadmaps();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapIcon color="var(--primary-color)" /> Manage {courseName} Roadmaps
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create new learning paths or rate existing ones.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={18} /> New Roadmap
                </button>
            </header>

            {showForm && (
                <form onSubmit={handleCreate} className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--secondary-color)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Create New Roadmap</h3>
                    <input 
                        type="text" 
                        placeholder="Roadmap Title (e.g. Master React in 30 Days)" 
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                    />
                    <textarea 
                        placeholder="Roadmap Content (Use new lines for steps)" 
                        rows={5}
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                        required
                    />
                    <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Publish Roadmap</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div>Loading roadmaps...</div>
            ) : roadmaps.length === 0 ? (
                <div className="glass-panel flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>
                    No roadmaps available. Be the first to create one!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {roadmaps.map(roadmap => (
                        <div key={roadmap.id} className="glass-card" style={{ padding: '32px' }}>
                            <div className="flex-between" style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary-color)' }}>{roadmap.title}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 'var(--border-radius-full)' }}>
                                        <Star size={18} color="var(--warning-color)" fill="var(--warning-color)" />
                                        <span style={{ fontWeight: 'bold' }}>{Number(roadmap.rating).toFixed(1)}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({roadmap.rating_count})</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                key={star}
                                                onClick={() => handleRate(roadmap.id, roadmap.rating, roadmap.rating_count, star)}
                                                style={{ color: 'var(--text-muted)', padding: '4px' }}
                                                title={`Rate ${star} stars`}
                                            >
                                                <Star size={16} />
                                            </button>
                                        ))}
                                    </div>
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
