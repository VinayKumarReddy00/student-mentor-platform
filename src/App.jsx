import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import StudentAuth from './pages/Auth/StudentAuth';
import MentorAuth from './pages/Auth/MentorAuth';
import StudentDashboard from './pages/Student/StudentDashboard';
import MentorDashboard from './pages/Mentor/MentorDashboard';

function App() {
  const { user, isSupabaseConfigured } = useAuth();
  const [hideBanner, setHideBanner] = useState(false);

  return (
    <HashRouter>
      {/* Dev notification if Supabase isn't configured */}
      {!isSupabaseConfigured && !hideBanner && (
        <div style={{ background: 'var(--warning-color)', color: '#000', padding: '12px', textAlign: 'center', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <span>Running in Mock Mode. Connect to Supabase via .env to enable real database features.</span>
          <button onClick={() => setHideBanner(true)} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'black' }}>
            Dismiss
          </button>
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/student" element={<StudentAuth />} />
        <Route path="/auth/mentor" element={<MentorAuth />} />

        {/* Protected Routes */}
        <Route 
          path="/student/*" 
          element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/mentor/*" 
          element={user?.role === 'mentor' ? <MentorDashboard /> : <Navigate to="/" />} 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Global Footer Task */}
      <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--surface-border)', opacity: 0.6 }}>
        <p>Developed by Vinay</p>
      </footer>
    </HashRouter>
  );
}

export default App;
