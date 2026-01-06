import React, { useState } from 'react';
import { User } from '../types';
import { useLanguage } from './LanguageContext';
import { Zap, ArrowRight, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  showDefaultInfo?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, showDefaultInfo = true }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError(t.auth.loginError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 pb-0 text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-200">
                <Zap size={32} className="text-white fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.auth.loginTitle}</h1>
            <p className="text-slate-500 text-sm">{t.auth.loginDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.auth.username}</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        placeholder="admin"
                        value={username}
                        onChange={e => {setUsername(e.target.value); setError('');}}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.auth.password}</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        placeholder="••••••"
                        value={password}
                        onChange={e => {setPassword(e.target.value); setError('');}}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold text-center animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
                {t.auth.loginBtn}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {showDefaultInfo && (
                <div className="text-center mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Default Login</p>
                    <p className="text-sm font-mono text-slate-700">User: <span className="font-bold">admin</span> | Pass: <span className="font-bold">123</span></p>
                </div>
            )}
        </form>
      </div>
    </div>
  );
};