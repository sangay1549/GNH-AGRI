import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Mail, User, ArrowRight, Sprout, Loader2, AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Branding Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl shadow-emerald-200 mb-4">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">GNH <span className="text-emerald-600">AGRI-TECH</span></h1>
        <p className="text-slate-500 font-medium">Digital Agriculture for the Kingdom of Bhutan</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        
        {/* Toggle Header */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-5 text-sm font-bold transition-all ${isLogin ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-5 text-sm font-bold transition-all ${!isLogin ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Create Account
          </button>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    placeholder="Sonam Dorji"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="farmer@gnh.bt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "Sign In" : "Get Started")}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-xs font-medium">
        Secure authentication powered by Supabase Auth
      </p>
    </div>
  );
};

export default AuthPage;