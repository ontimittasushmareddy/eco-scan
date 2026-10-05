import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Leaf, 
  Recycle, 
  HeartHandshake, 
  RotateCcw, 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Trees, 
  Zap, 
  Droplet, 
  Calendar, 
  Share2, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ImpactStats } from '../types';

export const ImpactView: React.FC = () => {
  const { user, setCurrentView, addToast, triggerConfetti } = useApp();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [passportShared, setPassportShared] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getImpactStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSharePassport = () => {
    triggerConfetti();
    setPassportShared(true);
    addToast({
      type: 'success',
      title: 'Eco-Passport Card Copied!',
      message: 'Share your verifiable circular impact badge with your campus or community!',
    });
    setTimeout(() => setPassportShared(false), 3000);
  };

  if (!user || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Computing your lifecycle environmental impact...</p>
      </div>
    );
  }

  // Calculate level progress percentage
  const currentPoints = user.ecoPoints;
  const nextTarget = user.nextLevelPoints;
  const progressPercent = Math.min(100, Math.round((currentPoints / nextTarget) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Sustainability Ledger
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Eco Impact & CO₂ Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tracking your tangible contributions toward diversion from landfills, carbon emissions avoided, and natural resource conservation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSharePassport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 text-xs font-bold shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            {passportShared ? 'Copied Link!' : 'Share Eco-Passport'}
          </button>
          <button
            onClick={() => setCurrentView('scanner')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Scan New Item
          </button>
        </div>
      </div>

      {/* Gamification Level Progression Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Glow orb background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                Current Standing
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                Streak: {user.streakDays} Days Active 🔥
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {user.ecoLevel}
              <Award className="w-7 h-7 text-amber-300" />
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Earn <strong>{nextTarget - currentPoints} more points</strong> by recycling, donating, or properly disposing of hazardous e-waste to level up.
            </p>
          </div>

          <div className="md:w-80 space-y-2 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-200">{currentPoints} EcoPoints</span>
              <span className="text-slate-300">Target: {nextTarget} pts</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-right text-emerald-200 font-bold">
              {progressPercent}% towards next rank
            </div>
          </div>
        </div>
      </div>

      {/* Main Impact Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Waste Diverted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <Leaf className="w-6 h-6" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 uppercase">
              Landfill Diverted
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {user.totalWasteDivertedKg} <span className="text-base font-semibold text-slate-500">kg</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Kept out of city incinerators & open dumps
            </p>
          </div>
        </div>

        {/* Metric 2: Estimated CO2 Avoided */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
              Carbon Abated
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {user.totalCo2AvoidedKg} <span className="text-base font-semibold text-slate-500">kg CO₂</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Avoided virgin manufacturing extraction
            </p>
          </div>
        </div>

        {/* Metric 3: Trees Equivalent */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <Trees className="w-6 h-6" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 uppercase">
              Bio-Equivalency
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ~{stats.treesEquivalent} <span className="text-base font-semibold text-slate-500">Trees</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Annual carbon absorption equivalent
            </p>
          </div>
        </div>

        {/* Metric 4: Energy & Water Conservation */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-600 mb-2">
            <Zap className="w-6 h-6" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 uppercase">
              Resources Conserved
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.kwhEnergySaved} <span className="text-base font-semibold text-slate-500">kWh</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Plus {stats.litersWaterSaved.toLocaleString()} L clean water saved
            </p>
          </div>
        </div>

      </div>

      {/* Breakdown by Action Types */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-600 block">Recycled</span>
            <span className="text-xl font-extrabold text-slate-900">{user.itemsRecycled} items</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-600 block">Reused</span>
            <span className="text-xl font-extrabold text-slate-900">{user.itemsReused} items</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-600 block">Donated</span>
            <span className="text-xl font-extrabold text-slate-900">{user.itemsDonated} items</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-600 block">Safely Disposed</span>
            <span className="text-xl font-extrabold text-slate-900">{user.itemsSafelyDisposed} items</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Weekly / Monthly Activity Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Diversion & Circular Activity Trend
              </h3>
              <p className="text-xs text-slate-500">
                Number of verified circular actions completed
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeframe === 'weekly' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                7-Day View
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeframe === 'monthly' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly Trajectory
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          {timeframe === 'weekly' ? (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
                {stats.weeklyTrend.map((d) => {
                  const maxCount = 6;
                  const heightPct = Math.round((d.count / maxCount) * 100);
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        +{d.points}pts
                      </span>
                      <div className="w-full max-w-[38px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-40">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-xl group-hover:from-emerald-500 group-hover:to-teal-400 transition-all duration-500"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{d.day}</span>
                      <span className="text-[10px] text-slate-400">{d.count} items</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>Peak activity: Saturday (6 items processed)</span>
                <span className="font-semibold text-emerald-700">+420 points earned this week</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-100">
                {stats.monthlyBreakdown.map((m) => {
                  const maxKg = 16;
                  const heightPct = Math.round((m.divertedKg / maxKg) * 100);
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.divertedKg}kg
                      </span>
                      <div className="w-full max-w-[44px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-40">
                        <div
                          className="w-full bg-gradient-to-t from-teal-600 to-emerald-500 rounded-t-xl group-hover:brightness-110 transition-all duration-500"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{m.month}</span>
                      <span className="text-[10px] text-slate-400">~{m.co2Kg}kg CO₂</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>Steady growth from 4.2 kg to 14.1 kg diverted / month</span>
                <span className="font-semibold text-teal-700">Cumulative CO₂ savings: 100+ kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Category Distribution Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Materials Diverted by Category
            </h3>
            <p className="text-xs text-slate-500">
              Composition of your processed items
            </p>
          </div>

          <div className="space-y-3.5">
            {stats.categoryBreakdown.map((cat, i) => {
              const colors = [
                'bg-blue-500',
                'bg-rose-500',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-purple-500',
              ];
              const barColor = colors[i % colors.length];

              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="font-bold text-slate-900">{cat.percentage}% ({cat.count} items)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Environmental Passport Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                Official Eco-Passport
              </span>
              <div className="text-xs font-bold text-slate-800">Verified Circular Contributor</div>
              <div className="text-[11px] text-slate-500">Certificate #ECO-2026-AR90</div>
            </div>
            <button
              onClick={handleSharePassport}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 shadow-xs"
              title="Download or share badge"
            >
              <Download className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
