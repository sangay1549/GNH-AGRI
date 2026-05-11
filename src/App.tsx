import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { FarmerLayout } from './layouts/FarmerLayout';
import { ClientLayout } from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

interface UserProfile {
  role: 'farmer' | 'client' | 'admin';
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<'farmer' | 'client' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single<UserProfile>();
      
      if (!error && data) {
        setRole(data.role); 
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-emerald-400 font-bold">
        VERIFYING PERMISSIONS...
      </div>
    );
  }

  return (
   <Routes>
  {!session ? (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  ) : (
    <>
      {/* ADMIN SECTION */}
      {role === 'admin' && (
        <>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      )}

      {/* FARMER SECTION */}
      {role === 'farmer' && (
        <>
          <Route path="/farmer-dashboard/*" element={<FarmerLayout />} />
          {/* ADD THIS REDIRECT 👇 */}
          <Route path="/" element={<Navigate to="/farmer-dashboard" replace />} />
        </>
      )}

      {/* CLIENT SECTION */}
      {role === 'client' && (
        <>
          <Route path="/client-dashboard/*" element={<ClientLayout />} />
          <Route path="/" element={<Navigate to="/client-dashboard" replace />} />
        </>
      )}

      {/* CATCH-ALL FOR UNKNOWN SUB-PATHS */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
      {/* ROLE NOT RECOGNIZED HANDLER */}
      {!role && (
        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
            <p className="text-red-400 font-bold mb-4">ASSIGNING PERMISSIONS...</p>
            <button onClick={() => supabase.auth.signOut()} className="bg-emerald-600 px-6 py-2 rounded-lg font-bold">
              Log Out & Try Again
            </button>
          </div>
        } />
      )}
    </>
  )}
</Routes>
  );
};
export default App;