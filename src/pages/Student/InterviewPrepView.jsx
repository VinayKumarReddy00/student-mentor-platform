import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { HelpCircle, Star, MessageSquare } from 'lucide-react';

export default function InterviewPrepView() {
    const { user, isSupabaseConfigured } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const courseName = user?.interested_course || 'General';

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setQuestions([
                { id: 1, question: `What is the most important concept in ${courseName}?`, answer: `Understanding the fundamentals of data flow and state management specific to ${courseName}.`, rating: 4.9, rating_count: 34 },
                { id: 2, question: `How would you handle errors in ${courseName}?`, answer: 'By implementing resilient try-catch blocks and maintaining a global error handling boundary.', rating: 4.5, rating_count: 18 },
            ]);
            setLoading(false);
            return;
        }

        const fetchQA = async () => {
            const { data, error } = await supabase
                .from('interview_qa')
                .select('*')
                .eq('course_name', courseName)
                .order('rating', { ascending: false });

            if (!error && data) {
                setQuestions(data);
            }
            setLoading(false);
        };

        fetchQA();
    }, [courseName, isSupabaseConfigured]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle color="var(--primary-color)" /> {courseName} Interview Prep
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Frequently asked interview questions with answers verified by mentors.</p>
            </header>

            {loading ? (
                <div>Loading questions...</div>
            ) : questions.length === 0 ? (
                <div className="glass-panel flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>
                    No interview questions available for {courseName} yet.
                </div>
            ) : (
                <div className="grid-cols-2">
                    {questions.map(qa => (
                        <div key={qa.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div className="flex-between" style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
                                    <MessageSquare size={18} /> Question
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                                    <Star size={14} color="var(--warning-color)" fill="var(--warning-color)" /> {Number(qa.rating).toFixed(1)}
                                </div>
                            </div>
                            
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', lineHeight: '1.4' }}>{qa.question}</h3>
                            
                            <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--secondary-color)' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Verified Answer:</p>
                                <p style={{ lineHeight: '1.6' }}>{qa.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
