import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Sprout, Loader2, AlertCircle, Users } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'farmer' | 'client'>('farmer');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // 1. Sign in the user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (authError) throw authError;

        // 2. Fetch the user's role from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user?.id)
          .single<{ role: string }>();

        if (profileError) throw profileError;

        // 3. FIXED REDIRECT LOGIC: Handle Admin role to prevent infinite loops
        console.log("Logged in role:", profile?.role);
        
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else if (profile?.role === 'farmer') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/client-dashboard');
        }

      } else {
        // Registration Logic
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { 
              full_name: fullName, 
              role: role 
            } 
          }
        });
        
        if (signUpError) throw signUpError;
        
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg mb-4">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          GNH <span className="text-emerald-600">Agri-Tech</span>
        </h1>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-5 font-bold transition-colors ${isLogin ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-5 font-bold transition-colors ${!isLogin ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex gap-2 text-xs font-bold items-center">
              <AlertCircle size={16}/>{error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
                      placeholder="Name" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Register As</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as any)} 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="farmer">Farmer / Producer</option>
                      <option value="client">Buyer / Customer</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="name@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;