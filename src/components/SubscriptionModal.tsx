import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Users, 
  TrendingUp, 
  X, 
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Download,
  Award,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, SubscriptionPlan, AuthUser } from '../types';

interface SubscriptionModalProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  currentUser?: AuthUser;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  profile,
  setProfile,
  currentUser,
  onClose
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'plans' | 'creator_monetization'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSimulatingCustomerView, setIsSimulatingCustomerView] = useState(false);

  // Projected subscribers simulator for deployment
  const [simulatedSubscribers, setSimulatedSubscribers] = useState(150);
  const monthlyPriceUSD = 9.99;
  const annualPriceUSD = 79.99;

  const isOwner = currentUser?.isOwner && !isSimulatingCustomerView;
  const currentPlan = isOwner ? 'lifetime_vip' : profile.subscription.plan;

  const handleSubscribe = (plan: SubscriptionPlan, price: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      setProfile({
        ...profile,
        subscription: {
          plan,
          status: 'active',
          expiresAt: new Date(Date.now() + (plan === 'pro_annual' ? 365 : plan === 'lifetime_vip' ? 3650 : 30) * 86400000).toISOString(),
          autoRenew: true,
          pricePaid: price,
          billingCycle: plan === 'pro_annual' ? 'annual' : plan === 'lifetime_vip' ? 'one_time' : 'monthly'
        }
      });
      setIsProcessing(false);
      setSuccessMessage(`🎉 Successfully upgraded to ${plan.replace('_', ' ').toUpperCase()}! All premium AI & offline packs unlocked.`);
      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
    }, 900);
  };

  const handleCancelSubscription = () => {
    setProfile({
      ...profile,
      subscription: {
        ...profile.subscription,
        plan: 'free',
        status: 'canceled',
        autoRenew: false
      }
    });
    setSuccessMessage('Switched back to Free Starter tier.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tab Switcher */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Membership Plans & Upgrades</span>
          </button>

          <button
            onClick={() => setActiveTab('creator_monetization')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'creator_monetization'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Deploy & Earn (SaaS Subscriptions)</span>
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 font-bold ml-2">✕</button>
          </div>
        )}

        {/* TAB 1: MEMBERSHIP TIERS (USER VIEW) */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            
            <div className="text-center max-w-xl mx-auto">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-2">
                Unlock Full Potential
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                FitRegion Pro Subscriptions
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Zero equipment home mastery, unlimited AI regional recipe optimizations, offline packs, and priority coaching.
              </p>

              {/* Monthly vs Annual Toggle */}
              <div className="inline-flex items-center gap-2 p-1.5 bg-slate-800 rounded-2xl border border-slate-700 mt-5">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly Billing ($9.99/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Annual Plan ($79.99/yr)</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                    Save 33%
                  </span>
                </button>
              </div>
            </div>

            {/* Owner VIP Status Banner */}
            {currentUser?.isOwner && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-emerald-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-300 text-sm">App Creator & Owner Pass Active</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                        $0 FREE FOREVER
                      </span>
                    </div>
                    <p className="text-slate-300 mt-0.5">
                      You have full unlocked Lifetime VIP access to all workout generators, regional recipes, offline modes, and admin tools.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSimulatingCustomerView(!isSimulatingCustomerView)}
                  className={`px-3 py-1.5 rounded-xl border font-bold text-[11px] flex items-center gap-1.5 transition-all shrink-0 ${
                    isSimulatingCustomerView
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isSimulatingCustomerView ? 'Exit Customer Preview' : 'Test Customer Paywall View'}
                </button>
              </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              {/* Free Starter */}
              <div className={`rounded-3xl p-6 border flex flex-col justify-between ${
                currentPlan === 'free'
                  ? 'bg-slate-800/40 border-slate-600'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Free Starter</h3>
                    {currentPlan === 'free' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-black text-white font-mono my-3">
                    $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Essential bodyweight workout schedule and basic local calorie logging.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard 4-Day Home Workout</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1 Sample Regional Meal Plan</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Daily Calorie & Water Tracker</li>
                    <li className="flex items-center gap-2 text-slate-500">✕ Unlimited AI Custom Generation</li>
                    <li className="flex items-center gap-2 text-slate-500">✕ Offline Video & Sound Sync</li>
                  </ul>
                </div>

                {currentPlan !== 'free' ? (
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Downgrade to Free
                  </button>
                ) : (
                  <div className="py-2.5 text-center text-xs text-slate-500 font-semibold">Active Free Tier</div>
                )}
              </div>

              {/* Pro Tier (Featured) */}
              <div className="rounded-3xl p-6 border-2 border-amber-500 bg-gradient-to-b from-amber-500/10 to-slate-900 relative shadow-xl shadow-amber-500/10 flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Most Popular
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">FitRegion Pro</h3>
                    {(currentPlan === 'pro_monthly' || currentPlan === 'pro_annual') && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        Active Sub
                      </span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-black text-amber-400 font-mono my-3">
                    {billingCycle === 'annual' ? '$79.99' : '$9.99'} 
                    <span className="text-xs text-slate-400 font-normal">
                      {billingCycle === 'annual' ? ' / year (~$6.66/mo)' : ' / month'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6">
                    Full AI customization for workout roadmaps, budget regional grocery optimization & offline audio coaching.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited AI Workout Roadmaps</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> All 9 Regional Cuisines & Recipes</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Dynamic Budget Cost Calculator</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited AI Nutrition Counselor</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Full Offline Generator & Caching</li>
                  </ul>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={() => handleSubscribe(billingCycle === 'annual' ? 'pro_annual' : 'pro_monthly', billingCycle === 'annual' ? 79.99 : 9.99)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Activating Pro Plan...' : (currentPlan === 'pro_annual' || currentPlan === 'pro_monthly') ? 'Renew / Update Pro' : `Subscribe ${billingCycle === 'annual' ? 'Annual ($79.99)' : 'Monthly ($9.99)'}`}
                </button>
              </div>

              {/* Lifetime VIP */}
              <div className={`rounded-3xl p-6 border flex flex-col justify-between ${
                currentPlan === 'lifetime_vip'
                  ? 'bg-slate-800/40 border-purple-500'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Lifetime VIP</h3>
                    {currentPlan === 'lifetime_vip' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500 text-white">
                        VIP Active
                      </span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-purple-400 font-mono my-3">
                    $149 <span className="text-xs text-slate-400 font-normal">/ one-time</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    Pay once, access all current and future home fitness roadmaps and regional culinary databases forever.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Everything in Pro Subscription</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Lifetime Updates & New Modules</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Priority Server AI Token Quota</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Direct Data Backup & Restore</li>
                  </ul>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={() => handleSubscribe('lifetime_vip', 149)}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                >
                  {currentPlan === 'lifetime_vip' ? 'VIP Active' : 'Get Lifetime Access ($149)'}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CREATOR & DEPLOYMENT MONETIZATION PORTAL */}
        {activeTab === 'creator_monetization' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-2">
                Deploy & Monetize Your App
              </span>
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                How to Charge Monthly & Annual Subscriptions
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                You can deploy this FitRegion app to Cloud Run or custom domains and charge fitness clients, gym members, or online subscribers on a recurring monthly/yearly basis.
              </p>
            </div>

            {/* Live Revenue Calculator Simulator */}
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                📈 SaaS Subscription Revenue Projection Simulator
              </h3>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span>Number of Paid Active Subscribers:</span>
                  <span className="text-emerald-400 font-bold text-base">{simulatedSubscribers} users</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={simulatedSubscribers}
                  onChange={e => setSimulatedSubscribers(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] uppercase text-slate-400 block mb-1">Monthly Recurring (MRR)</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${Math.round(simulatedSubscribers * monthlyPriceUSD).toLocaleString()} / mo
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] uppercase text-slate-400 block mb-1">Annual Recurring (ARR)</span>
                  <span className="text-2xl font-black text-teal-300 font-mono">
                    ${Math.round(simulatedSubscribers * monthlyPriceUSD * 12).toLocaleString()} / yr
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] uppercase text-slate-400 block mb-1">Estimated Server Cost</span>
                  <span className="text-2xl font-black text-slate-300 font-mono">
                    ~${Math.round(simulatedSubscribers * 0.05 + 10)} / mo
                  </span>
                </div>
              </div>
            </div>

            {/* Step by step deployment monetization guide */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Steps to Launch and Charge Subscribers:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2">1</span>
                  <strong className="text-white block">Deploy to Cloud Run</strong>
                  <p className="text-slate-400">Click the Deploy button in Google AI Studio or host on your custom domain.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-2">2</span>
                  <strong className="text-white block">Connect Payment Gateway</strong>
                  <p className="text-slate-400">Link Stripe Checkout, LemonSqueezy, or PayPal subscriptions to your user accounts.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center mb-2">3</span>
                  <strong className="text-white block">Distribute Worldwide</strong>
                  <p className="text-slate-400">Users in any country can subscribe, train at home, and access region-specific budget meal plans.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
