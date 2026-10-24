import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  Sparkles, 
  UserCheck, 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Building2,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, language, setLanguage, t } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('candidate@taaltalent.com');
  const [password, setPassword] = useState('candidate123');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@taaltalent.com');
      setPassword('admin123');
    } else {
      setEmail('candidate@taaltalent.com');
      setPassword('candidate123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = selectedRole === 'admin' ? 'Admin Reviewer' : 'Candidate';
    login(email, selectedRole, name);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleQuickLogin = (role: UserRole) => {
    const roleEmail = role === 'admin' ? 'admin@taaltalent.com' : 'candidate@taaltalent.com';
    const name = role === 'admin' ? 'Admin Reviewer' : 'Candidate';
    login(roleEmail, role, name);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 text-white selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar with Language Toggle */}
      <div className="absolute top-5 right-5 sm:right-8 flex items-center gap-2">
        <div className="flex items-center bg-white/10 backdrop-blur-md p-0.5 rounded-xl border border-white/15 text-xs font-semibold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
              language === 'en'
                ? 'bg-white text-indigo-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
              language === 'hi'
                ? 'bg-white text-indigo-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>हिन्दी</span>
          </button>
        </div>
      </div>

      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Shield className="w-7 h-7" />
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              Taal<span className="text-indigo-400">Talent</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              RBAC v2.0
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? 'प्रवेश करें: उम्मीदवार आवेदन प्रस्तुत कर सकते हैं और एडमिन अनुमोदन कर सकते हैं।'
              : 'Sign in to access Job Application Tracker & Scam Protection.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
          
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'भूमिका चुनें (Role):' : 'Select Access Role:'}
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('user')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'user'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'उम्मीदवार (User)' : 'Candidate (User)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'hi' ? 'व्यवस्थापक (Admin)' : 'HR Admin'}</span>
              </button>
            </div>
          </div>

          {/* Role Capability Banner */}
          <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
            selectedRole === 'admin' 
              ? 'bg-purple-50 text-purple-900 border-purple-200' 
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}>
            {selectedRole === 'admin' ? (
              <p>
                <strong>Admin Privileges:</strong> Full authority to approve or decline candidate applications, review high-risk scam alerts, and inspect pipeline metrics.
              </p>
            ) : (
              <p>
                <strong>Candidate Access:</strong> Browse verified employers, submit new job applications, and track application approval progress.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
                selectedRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
              }`}
            >
              <span>{language === 'hi' ? 'लॉगिन करें' : `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Candidate'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Instant Demo Login Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              1-Click Instant Demo Access
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <span>⚡ Candidate Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-purple-700 border border-slate-200 hover:border-purple-200 text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <span>⚡ Admin Demo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          TaalTalent · Autonomous Job Hunt & Scam Protection · Hackathon Demo
        </p>

      </div>

    </div>
  );
};
