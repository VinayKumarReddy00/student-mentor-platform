import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Mail, Phone, Lock, BookOpen, User } from 'lucide-react';

export default function MentorAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [profession, setProfession] = useState('');
    const [expertise, setExpertise] = useState('');
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Mock logic check
            const emailToUse = email.includes('@') ? email : `${email}@mentor.mock.com`;

            let result;
            if (isLogin) {
                result = await login(emailToUse, password);
            } else {
                result = await signup(emailToUse, password, {
                    role: 'mentor',
                    full_name: fullName,
                    phone_number: phone,
                    profession: profession,
                    course_expertise: expertise
                });
            }

            if (result.error) {
                setError(result.error.message);
            } else {
                navigate('/mentor/dashboard');
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px', borderLeft: '4px solid var(--primary-color)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', marginBottom: '16px' }}>
                        <Briefcase size={32} color="var(--primary-color)" />
                    </div>
                    <h2>Mentor {isLogin ? 'Portal' : 'Registration'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        {isLogin ? 'Welcome back! Ready to guide?' : 'Apply to become a mentor.'}
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
                                <Phone size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <input type="text" placeholder="Phone Number" required value={phone} onChange={e => setPhone(e.target.value)} style={{ paddingLeft: '48px' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <input type="text" placeholder="Working Profession (e.g. Sr. Dev at Google)" required value={profession} onChange={e => setProfession(e.target.value)} style={{ paddingLeft: '48px' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                                <select required value={expertise} onChange={e => setExpertise(e.target.value)} style={{ paddingLeft: '48px', appearance: 'none' }}>
                                    <option value="" disabled>Select Course Expertise</option>
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
                        <input type="text" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '48px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '48px' }} />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px', borderRadius: 'var(--border-radius-full)', fontWeight: 'bold' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Apply')}
                    </button>
                    
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? "Want to be a mentor? " : "Already a mentor? "}
                        <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--secondary-color)', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', fontWeight: '500' }}>
                            {isLogin ? 'Apply now' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
