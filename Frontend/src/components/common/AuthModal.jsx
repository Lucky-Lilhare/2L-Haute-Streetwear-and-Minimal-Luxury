import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    showToast
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await loginUser({ email, password });
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || 'Invalid email or password credentials.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await registerUser({ name, email, password, phone });
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || 'Registration failed. Please try again.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    await loginUser({ email: 'adrian.vance@atelier-2l.com', password: 'password123' });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-[#111115] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              {authModalMode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                {authModalMode === 'signin' ? 'Sign In to 2L' : 'Create 2L Account'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {authModalMode === 'signin' ? 'Access your orders & exclusive drops' : 'Join Noir VIP and unlock member perks'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-900 border border-white/10 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              authModalMode === 'signin'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              authModalMode === 'signup'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM: Sign In */}
        {authModalMode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adrian@atelier-2l.com"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-neutral-500">Min 4 chars</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 pr-10 focus:outline-none transition-all font-mono"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Quick Demo One-Click Sign In */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 hover:border-amber-400/40 text-neutral-300 hover:text-amber-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>⚡ 1-Click Demo Login (Adrian Vance)</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-neutral-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setErrorMsg('');
                  }}
                  className="text-white underline font-semibold hover:text-amber-300 cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* FORM: Sign Up */
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maya@example.com"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 pr-10 focus:outline-none transition-all font-mono"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full bg-neutral-900/90 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                />
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-300 flex items-center space-x-2">
              <Sparkles size={14} className="shrink-0 text-amber-400" />
              <span>Includes 200 welcome Noir VIP points on signup!</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Create Account & Join</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-neutral-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signin');
                    setErrorMsg('');
                  }}
                  className="text-white underline font-semibold hover:text-amber-300 cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
