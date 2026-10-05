import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Leaf, 
  ShieldCheck, 
  Camera, 
  Recycle, 
  HeartHandshake, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Calendar,
  Building,
  Mail,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const ProfileView: React.FC = () => {
  const { user, refreshUserData, addToast, setCurrentView } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [orgType, setOrgType] = useState(user?.orgType || 'campus');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateUserProfile({
        name,
        email,
        organization,
        orgType: orgType as any,
      });
      await refreshUserData();
      setEditing(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information and community affiliation have been saved.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Could not update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  ];

  const handleSelectAvatar = async (url: string) => {
    try {
      await api.updateUserProfile({ avatarUrl: url });
      await refreshUserData();
      addToast({
        type: 'info',
        title: 'Avatar Changed',
        message: 'Your profile avatar has been updated.',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar and switcher */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative group">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                ⚡
              </div>
            </div>

            {/* Quick avatar selection */}
            <div className="flex gap-1.5 pt-1">
              {sampleAvatars.map((av, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                    user.avatarUrl === av ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="av" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-center sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                {user.ecoLevel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                {user.organization || 'Independent'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">EcoPoints</span>
                <span className="text-lg font-black text-emerald-700">{user.ecoPoints}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Diverted</span>
                <span className="text-lg font-black text-slate-800">{user.totalWasteDivertedKg} kg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">CO₂ Prevented</span>
                <span className="text-lg font-black text-slate-800">~{user.totalCo2AvoidedKg} kg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Streak</span>
                <span className="text-lg font-black text-amber-600">{user.streakDays} Days</span>
              </div>
            </div>

          </div>

        </div>

        {/* Edit Form Drawer */}
        {editing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus / Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Stanford University or Green Tech High"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliation Type</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="campus">University / College Campus</option>
                <option value="school">High School</option>
                <option value="workplace">Company / Workplace</option>
                <option value="community">Neighborhood / Community</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Badges and Achievements Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements & Badges
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Trophies unlocked through sustainable circular choices
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {user.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-sm shadow-emerald-600/20">
                  🏆
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{badge.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                <span>{badge.requirement}</span>
                <span className="text-emerald-600">✓ Earned</span>
              </div>
            </div>
          ))}

          {/* Locked Badge Teaser */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col justify-between opacity-60">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center text-xl mb-3">
                🔒
              </div>
              <h4 className="font-bold text-sm text-slate-700 mb-1">Master Circular Alchemist</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Complete 15 upcycle creative transformations.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-semibold">
              In progress (1 / 15)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
