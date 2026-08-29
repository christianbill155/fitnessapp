import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  LogOut, 
  Users, 
  KeyRound,
  Download,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, StoredAccount, UserProfile } from '../types';
import { 
  DEFAULT_OWNER_EMAIL,
  getCurrentUser, 
  loginAsOwner, 
  loginAsGuest, 
  loginAccount, 
  registerAccount, 
  getStoredAccounts, 
  switchAccount, 
  removeStoredAccount 
} from '../services/auth';

interface AuthModalProps {
  currentUser: AuthUser;
  setCurrentUser: (user: AuthUser) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onOpenSubscription?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  setCurrentUser,
  profile,
  setProfile,
  onClose,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'owner_pass' | 'signin' | 'signup' | 'guest' | 'accounts'>('owner_pass');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [guestName, setGuestName] = useState('Offline Athlete');
  const [customOwnerEmail, setCustomOwnerEmail] = useState(DEFAULT_OWNER_EMAIL);

  const [storedAccountsList, setStoredAccountsList] = useState<StoredAccount[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStoredAccountsList(getStoredAccounts());
    if (currentUser.isOwner) {
      setCustomOwnerEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleOwnerLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAsOwner(customOwnerEmail);
      setCurrentUser(res.user);
      
      // Upgrade profile to lifetime VIP free forever
      setProfile({
        ...profile,
        name: profile.name === 'Alex Rivers' ? 'App Creator' : profile.name,
        subscription: {
          plan: 'lifetime_vip',
          status: 'active',
          expiresAt: '2099-12-31T23:59:59.000Z',
          autoRenew: true,
          pricePaid: 0,
          billingCycle: 'one_time'
        }
      });

      setSuccessMessage(res.message);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to activate owner pass');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAsGuest(guestName);
      setCurrentUser(res.user);
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e: any) {
      setErrorMessage('Failed to start offline session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAccount(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (res.user.isOwner) {
          setProfile({
            ...profile,
            subscription: {
              plan: 'lifetime_vip',
              status: 'active',
              expiresAt: '2099-12-31T23:59:59.000Z',
              autoRenew: true,
              pricePaid: 0,
              billingCycle: 'one_time'
            }
          });
        }
        setSuccessMessage(`Welcome back, ${res.user.displayName}!`);
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await registerAccount(email, password, displayName);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setSuccessMessage(`Account created successfully! Welcome, ${res.user.displayName}`);
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchUser = (userId: string) => {
    const user = switchAccount(userId);
    if (user) {
      setCurrentUser(user);
      setSuccessMessage(`Switched active profile to ${user.displayName}`);
      setStoredAccountsList(getStoredAccounts());
      setTimeout(() => onClose(), 800);
    }
  };

  const handleDeleteAccount = (userId: string) => {
    if (confirm('Are you sure you want to remove this stored account from this device?')) {
      removeStoredAccount(userId);
      setStoredAccountsList(getStoredAccounts());
      const curr = getCurrentUser();
      setCurrentUser(curr);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Current Active Account Header Badge */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner">
              {currentUser.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{currentUser.displayName}</span>
                {currentUser.isOwner ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> CREATOR OWNER (FREE VIP)
                  </span>
                ) : currentUser.role === 'guest' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    ⚡ OFFLINE GUEST
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    MEMBER
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[240px] sm:max-w-xs">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
          <button
            onClick={() => { setActiveTab('owner_pass'); setErrorMessage(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'owner_pass'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-amber-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Creator Pass</span>
          </button>

          <button
            onClick={() => { setActiveTab('guest'); setErrorMessage(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'guest'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offline Guest</span>
          </button>

          <button
            onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'signin'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'signup'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>New Account</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: CREATOR OWNER PASS (1-Click Lifetime Free VIP) */}
        {activeTab === 'owner_pass' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-500/5 border border-amber-500/30 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Creator Free Lifetime Pass</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    As the developer and owner of FitRegion, you get <strong className="text-amber-300 font-bold">100% Free Lifetime Access</strong> to every feature, offline workout packs, regional culinary databases, and unlimited customization forever — even after deployment.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> $0 Free VIP Subscription
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Offline Ready
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Creator MRR Portal
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited Roadmap Exports
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Owner Email Identifier:
              </label>
              <input
                type="email"
                value={customOwnerEmail}
                onChange={(e) => setCustomOwnerEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                placeholder="poccnkcc@gmail.com"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Your email (<span className="text-amber-400 font-mono">poccnkcc@gmail.com</span>) is pre-authorized for free administrator ownership.
              </p>
            </div>

            <button
              onClick={handleOwnerLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              {isLoading ? 'Activating Pass...' : 'Activate Owner Pass & Unlock Free Lifetime VIP'}
            </button>
          </div>
        )}

        {/* TAB 2: 1-CLICK OFFLINE GUEST */}
        {activeTab === 'guest' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Standalone Offline Mode</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Use FitRegion anywhere without internet connection, WiFi, or account creation. All workout intervals, voice timer cues, and meal plans are stored locally in your browser/device.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Local Athlete Display Name:
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Offline Athlete"
              />
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <WifiOff className="w-4 h-4" />
              {isLoading ? 'Starting...' : 'Continue in 100% Offline Mode'}
            </button>
          </div>
        )}

        {/* TAB 3: SIGN IN */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>
          </form>
        )}

        {/* TAB 4: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Full Name / Athlete Name:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Jordan Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Create Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="At least 4 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Creating Account...' : 'Create Local & Offline Account'}
            </button>
          </form>
        )}

        {/* Stored Accounts List on Device */}
        {storedAccountsList.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Stored Profiles on this Device ({storedAccountsList.length})
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {storedAccountsList.map((acc) => (
                <div
                  key={acc.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    acc.id === currentUser.id
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{acc.avatar || '👤'}</span>
                    <div>
                      <div className="font-semibold flex items-center gap-1 text-slate-200">
                        {acc.displayName}
                        {acc.isOwner && <Crown className="w-3 h-3 text-amber-400" />}
                        {acc.id === currentUser.id && (
                          <span className="text-[10px] text-emerald-400 font-bold">(Active)</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{acc.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {acc.id !== currentUser.id && (
                      <button
                        onClick={() => handleSwitchUser(acc.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                      >
                        Switch
                      </button>
                    )}
                    {storedAccountsList.length > 1 && acc.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Remove profile"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
