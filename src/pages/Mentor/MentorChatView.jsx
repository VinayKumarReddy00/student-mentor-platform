import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Send, User, RefreshCcw } from 'lucide-react';

export default function MentorChatView() {
    const { user, isSupabaseConfigured } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Mentor answers queries in their expertise area
    const courseName = user?.course_expertise || 'General';

    const fetchMessages = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setIsRefreshing(true);

        if (!isSupabaseConfigured) {
            // Read from LocalStorage using the same key the Student view uses, so they share mock chats based on the course
            const mockStorageKey = `mockChats_${courseName.replace(/\s+/g, '')}`;
            const existingChatsStr = localStorage.getItem(mockStorageKey);

            if (existingChatsStr) {
                setMessages(JSON.parse(existingChatsStr));
            } else {
                const initialChats = [
                    { id: 1, content: 'Can someone explain dependency injection in Spring Boot?', sender_role: 'student', sender_name: 'John Student', created_at: new Date().toISOString() },
                ];
                setMessages(initialChats);
                localStorage.setItem(mockStorageKey, JSON.stringify(initialChats));
            }

            if (showLoading) setLoading(false);
            setIsRefreshing(false);
            return;
        }

        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                id, content, created_at,
                sender:profiles(full_name, role)
            `)
            .eq('course_name', courseName)
            .order('created_at', { ascending: true });
            
        if (!error && data) {
            const formatted = data.map(msg => ({
                ...msg,
                sender_name: msg.sender?.full_name || 'Unknown User',
                sender_role: msg.sender?.role || 'student'
            }));
            setMessages(formatted);
        }
        if (showLoading) setLoading(false);
        setIsRefreshing(false);
    }, [courseName, isSupabaseConfigured]);

    useEffect(() => {
        fetchMessages(true);

        // Auto Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchMessages(false);
        }, 5000);

        // Subscribe to real-time updates if Supabase is configured
        let subscription;
        if (isSupabaseConfigured) {
            subscription = supabase
                .channel('public:chat_messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `course_name=eq.${courseName}` }, payload => {
                    fetchMessages(false);
                })
                .subscribe();
        }

        return () => {
            clearInterval(interval);
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [fetchMessages, isSupabaseConfigured, courseName]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (!isSupabaseConfigured) {
            const newMsgObj = {
                id: Date.now(),
                content: newMessage,
                sender_name: user?.full_name,
                sender_role: user?.role,
                created_at: new Date().toISOString()
            };

            const updatedMessages = [...messages, newMsgObj];
            setMessages(updatedMessages);
            setNewMessage('');

            // Write back to LocalStorage
            const mockStorageKey = `mockChats_${courseName.replace(/\s+/g, '')}`;
            localStorage.setItem(mockStorageKey, JSON.stringify(updatedMessages));

            return;
        }

        const { error } = await supabase.from('chat_messages').insert([{
            course_name: courseName,
            content: newMessage,
            sender_id: user.id
        }]);

        if (!error) {
            setNewMessage('');
            fetchMessages(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary-color)' }}>{courseName}</span> Mentorship Channel
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Provide guidance to students asking questions within your expertise.</p>
                </div>
                <button 
                    onClick={() => fetchMessages(false)} 
                    className="btn-outline refresh-btn"
                    style={{ 
                        padding: '8px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        transition: 'transform 0.3s ease'
                    }}
                    title="Refresh Chat"
                >
                    <RefreshCcw size={18} className={isRefreshing ? 'spin' : ''} />
                </button>
            </header>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: '4px solid var(--primary-color)' }}>
                {/* Messages Area */}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <div className="flex-center" style={{ height: '100%' }}>Loading chat...</div>
                    ) : messages.length === 0 ? (
                        <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>No student queries yet.</div>
                    ) : (
                        messages.map(msg => {
                            const isMe = msg.sender_name === user?.full_name;
                            const isStudent = msg.sender_role === 'student';
                            
                            return (
                                <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isStudent ? 'var(--secondary-color)' : 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={12} color="white" />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: isMe ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: !isStudent ? 'bold' : 'normal' }}>
                                            {msg.sender_name} {isStudent ? '(Student)' : '(Mentor)'}
                                        </span>
                                    </div>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: 'var(--border-radius-md)',
                                        background: isMe ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        borderBottomRightRadius: isMe ? '4px' : 'var(--border-radius-md)',
                                        borderBottomLeftRadius: !isMe ? '4px' : 'var(--border-radius-md)',
                                        borderLeft: !isMe && !isStudent ? '3px solid var(--primary-color)' : 'none'
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="Provide your helpful insight..." 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        style={{ flex: 1, borderRadius: 'var(--border-radius-full)' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', background: 'var(--primary-color)' }}>
                        <Send size={18} /> Send Reply
                    </button>
                </form>
            </div>

            <style>{`
                .refresh-btn:hover {
                    color: white !important;
                    background: rgba(255,255,255,0.1) !important;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
