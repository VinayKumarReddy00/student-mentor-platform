import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Phone, Lock, Book, User } from 'lucide-react';

export default function StudentAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    
    // Form State
    const [authIdentifier, setAuthIdentifier] = useState(''); // Email or Phone
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [interestedCourse, setInterestedCourse] = useState('');
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // For mock logic, if it starts with number, treat as phone, else email.
            // In real app, you might use Supabase signInWithOtp for phone. We use signInWithPassword for simplicity here.
            const emailToUse = authIdentifier.includes('@') ? authIdentifier : `${authIdentifier}@student.mock.com`;

            let result;
            if (isLogin) {
                result = await login(emailToUse, password);
            } else {
                result = await signup(emailToUse, password, {
                    role: 'student',
                    full_name: fullName,
                    phone_number: authIdentifier.includes('@') ? null : authIdentifier,
                    education_level: educationLevel,
                    interested_course: interestedCourse
                });
            }

            if (result.error) {
                setError(result.error.message);
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '16px' }}>
                        <GraduationCap size={32} color="var(--secondary-color)" />
                    </div>
                    <h2>Student {isLogin ? 'Login' : 'Registration'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        {isLogin ? 'Welcome back! Ready to learn?' : 'Create an account to start your journey.'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {!isLogin && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <input type="text" placeholder="Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} style={{ paddingLeft: '48px' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Book size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <input type="text" placeholder="Class / Education Level" required value={educationLevel} onChange={e => setEducationLevel(e.target.value)} style={{ paddingLeft: '48px' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <select required value={interestedCourse} onChange={e => setInterestedCourse(e.target.value)} style={{ paddingLeft: '48px', appearance: 'none' }}>
                                    <option value="" disabled>Select Interested Course</option>
                                    <option value="Java">Java</option>
                                    <option value="Python">Python</option>
                                    <option value="Ethical Hacking">Ethical Hacking</option>
                                    <option value="Web Development">Web Development</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                        <input type="text" placeholder="Email or Phone Number" required value={authIdentifier} onChange={e => setAuthIdentifier(e.target.value)} style={{ paddingLeft: '48px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '48px' }} />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                    
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', fontWeight: '500' }}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
