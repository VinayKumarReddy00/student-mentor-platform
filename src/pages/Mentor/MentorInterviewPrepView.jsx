import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { HelpCircle, Star, MessageSquare, Plus } from 'lucide-react';

export default function MentorInterviewPrepView() {
    const { user, isSupabaseConfigured } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const courseName = user?.course_expertise || 'General';

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setQuestions([
                { id: 1, question: `What is the most important concept in ${courseName}?`, answer: `Understanding the fundamentals of data flow and state management specific to ${courseName}.`, rating: 4.9, rating_count: 34 },
                { id: 2, question: `How would you handle errors in ${courseName}?`, answer: 'By implementing resilient try-catch blocks and maintaining a global error handling boundary.', rating: 4.5, rating_count: 18 },
            ]);
            setLoading(false);
            return;
        }

        fetchQA();
    }, [courseName, isSupabaseConfigured]);

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

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim() || !newAnswer.trim()) return;

        if (!isSupabaseConfigured) {
            setQuestions(prev => [{
                id: Date.now(),
                question: newQuestion,
                answer: newAnswer,
                rating: 0,
                rating_count: 0
            }, ...prev]);
            setShowForm(false);
            setNewQuestion('');
            setNewAnswer('');
            return;
        }

        const { error } = await supabase.from('interview_qa').insert([{
            course_name: courseName,
            question: newQuestion,
            answer: newAnswer,
            created_by: user.id
        }]);

        if (!error) {
            setShowForm(false);
            setNewQuestion('');
            setNewAnswer('');
            fetchQA();
        }
    };

    const handleRate = async (qaId, currentRating, currentCount, newRateScore) => {
        if (!isSupabaseConfigured) {
            setQuestions(prev => prev.map(q => {
                if(q.id === qaId) {
                    const totalScore = (q.rating * q.rating_count) + newRateScore;
                    const newCount = q.rating_count + 1;
                    return { ...q, rating: totalScore / newCount, rating_count: newCount };
                }
                return q;
            }));
            return;
        }

        const totalScore = (currentRating * currentCount) + newRateScore;
        const newCount = currentCount + 1;
        const newAverage = totalScore / newCount;

        await supabase.from('interview_qa')
            .update({ rating: newAverage, rating_count: newCount })
            .eq('id', qaId);
            
        fetchQA();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <HelpCircle color="var(--primary-color)" /> Manage {courseName} Q&A
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Add common interview questions and provide expert answers.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={18} /> Add Q&A
                </button>
            </header>

            {showForm && (
                <form onSubmit={handleCreate} className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--secondary-color)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Add Interview Question</h3>
                    <input 
                        type="text" 
                        placeholder="Common Interview Question" 
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        required
                    />
                    <textarea 
                        placeholder="Comprehensive Answer" 
                        rows={4}
                        value={newAnswer}
                        onChange={e => setNewAnswer(e.target.value)}
                        required
                    />
                    <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Q&A</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div>Loading questions...</div>
            ) : questions.length === 0 ? (
                <div className="glass-panel flex-center" style={{ flex: 1, color: 'var(--text-muted)' }}>
                    No interview questions available yet.
                </div>
            ) : (
                <div className="grid-cols-2">
                    {questions.map(qa => (
                        <div key={qa.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div className="flex-between" style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
                                    <MessageSquare size={18} /> Question
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                                        <Star size={14} color="var(--warning-color)" fill="var(--warning-color)" /> {Number(qa.rating).toFixed(1)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                key={star}
                                                onClick={() => handleRate(qa.id, qa.rating, qa.rating_count, star)}
                                                style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
                                                title={`Rate ${star} stars`}
                                            >
                                                <Star size={12} />
                                            </button>
                                        ))}
                                    </div>
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
