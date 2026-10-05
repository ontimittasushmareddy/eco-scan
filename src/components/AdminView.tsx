import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  MapPin, 
  Target, 
  BarChart3, 
  Users, 
  Recycle, 
  TrendingUp, 
  Check, 
  Edit3,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DropOffLocation, Challenge, WasteCategory } from '../types';

export const AdminView: React.FC = () => {
  const { addToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [locations, setLocations] = useState<DropOffLocation[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'locations' | 'challenges' | 'categories'>('analytics');

  // New location form state
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState('Recycling Center');
  const [newLocCategoryKey, setNewLocCategoryKey] = useState<'recycling' | 'e_waste' | 'donation' | 'batteries' | 'textiles' | 'safe_disposal'>('recycling');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocDistance, setNewLocDistance] = useState('2.5');
  const [newLocHours, setNewLocHours] = useState('Mon-Sat 8:00 AM – 5:00 PM');
  const [newLocPhone, setNewLocPhone] = useState('(555) 123-4567');

  // New challenge form state
  const [newChalTitle, setNewChalTitle] = useState('');
  const [newChalDesc, setNewChalDesc] = useState('');
  const [newChalTarget, setNewChalTarget] = useState('5');
  const [newChalPoints, setNewChalPoints] = useState('100');
  const [newChalBadge, setNewChalBadge] = useState('Eco Hero Star');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [anData, locData, chalData] = await Promise.all([
        api.getAnalytics(),
        api.getLocations(),
        api.getChallenges(),
      ]);
      setAnalytics(anData);
      setLocations(locData);
      setChallenges(chalData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocAddress) return;

    try {
      const added = await api.addLocation({
        name: newLocName,
        type: newLocType as any,
        categoryKey: newLocCategoryKey,
        address: newLocAddress,
        distanceKm: parseFloat(newLocDistance) || 2.0,
        hours: newLocHours,
        phone: newLocPhone,
        isOpen: true,
        supportedCategories: ['plastic', 'electronics', 'batteries'],
      });
      setLocations((prev) => [...prev, added]);
      setNewLocName('');
      setNewLocAddress('');
      addToast({
        type: 'success',
        title: 'Facility Created',
        message: `${added.name} is now published to the public map directory.`,
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err?.message });
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await api.deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      addToast({
        type: 'info',
        title: 'Location Deleted',
        message: 'The facility has been removed from the registry.',
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err?.message });
    }
  };

  const handleAddChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChalTitle || !newChalDesc) return;

    try {
      const added = await api.addChallenge({
        title: newChalTitle,
        description: newChalDesc,
        targetCount: parseInt(newChalTarget, 10) || 5,
        pointsReward: parseInt(newChalPoints, 10) || 100,
        badgeReward: newChalBadge,
        categoryBadge: 'General Sprint',
        daysRemaining: 14,
      });
      setChallenges((prev) => [...prev, added]);
      setNewChalTitle('');
      setNewChalDesc('');
      addToast({
        type: 'success',
        title: 'Challenge Created',
        message: `${added.title} is now active for all participants!`,
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err?.message });
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Remove this challenge?')) return;
    try {
      await api.deleteChallenge(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      addToast({
        type: 'info',
        title: 'Challenge Removed',
        message: 'Challenge deleted successfully.',
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err?.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Administrative Infrastructure & Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            EcoScan Operations Console
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage certified drop-off centers, monitor ecosystem throughput, configure community sprints, and oversee classification categories.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            System Analytics
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'locations' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Manage Locations ({locations.length})
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'challenges' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Manage Challenges ({challenges.length})
          </button>
        </div>
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Active Users</span>
              <span className="text-2xl font-black text-slate-900">{analytics.totalUsers.toLocaleString()}</span>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Across 18 institutions</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total AI Scans</span>
              <span className="text-2xl font-black text-slate-900">{analytics.totalScans.toLocaleString()}</span>
              <p className="text-xs text-slate-500 font-medium mt-1">Accuracy: {analytics.aiAccuracyRate}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Waste Diverted</span>
              <span className="text-2xl font-black text-teal-700">{analytics.totalWasteDivertedKg.toLocaleString()} kg</span>
              <p className="text-xs text-teal-600 font-medium mt-1">~{analytics.totalCo2AvoidedKg.toLocaleString()} kg CO₂</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Items Donated / Reused</span>
              <span className="text-2xl font-black text-amber-700">{(analytics.totalDonatedItems + analytics.totalReusedItems).toLocaleString()}</span>
              <p className="text-xs text-amber-600 font-medium mt-1">Circular second lives</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              System Health & Autonomous Classification Status
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Gemini 3.8 Multimodal inference pipeline is responding in real-time. Regional drop-off endpoints are synced with open municipal geospatial datasets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <strong>Status:</strong> All API routes operational (99.98% uptime)
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <strong>Gemini Model:</strong> gemini-3.8-flash (JSON Mode enabled)
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <strong>Certified Locations:</strong> {locations.length} live drop-off depots
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOCATIONS TAB */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Register New Drop-Off Facility
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add authorized recyclers, battery depositories, or donation centers.
            </p>

            <form onSubmit={handleAddLocation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Center Name</label>
                <input
                  type="text"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. EcoTech Silicon Battery Depot"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Recycling Center">Recycling Center</option>
                    <option value="E-Waste Hub">E-Waste Hub</option>
                    <option value="Donation Center">Donation Center</option>
                    <option value="Battery Drop-Off">Battery Drop-Off</option>
                    <option value="Textile Collection">Textile Collection</option>
                    <option value="Hazardous Disposal">Hazardous Disposal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Key</label>
                  <select
                    value={newLocCategoryKey}
                    onChange={(e) => setNewLocCategoryKey(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="recycling">Recycling</option>
                    <option value="e_waste">E-Waste</option>
                    <option value="donation">Donation</option>
                    <option value="batteries">Batteries</option>
                    <option value="textiles">Textiles</option>
                    <option value="safe_disposal">Hazardous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Gate 2"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLocDistance}
                    onChange={(e) => setNewLocDistance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={newLocHours}
                    onChange={(e) => setNewLocHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs mt-2"
              >
                Publish Facility to Public Map
              </button>
            </form>
          </div>

          {/* Locations Registry List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Registered Disposal Infrastructure ({locations.length})
            </h3>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
              {locations.map((loc) => (
                <div key={loc.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{loc.name}</span>
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold rounded text-[10px]">
                        {loc.type}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{loc.address} • {loc.distanceKm} km</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete facility"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Launch Community Eco-Sprint
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create monthly sustainability challenges for universities and campuses.
            </p>

            <form onSubmit={handleAddChallenge} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Challenge Title</label>
                <input
                  type="text"
                  value={newChalTitle}
                  onChange={(e) => setNewChalTitle(e.target.value)}
                  placeholder="e.g. October Zero-Landfill Campus Sprint"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newChalDesc}
                  onChange={(e) => setNewChalDesc(e.target.value)}
                  placeholder="Explain what items participants should divert..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Items</label>
                  <input
                    type="number"
                    value={newChalTarget}
                    onChange={(e) => setNewChalTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bonus Points</label>
                  <input
                    type="number"
                    value={newChalPoints}
                    onChange={(e) => setNewChalPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reward Badge Name</label>
                <input
                  type="text"
                  value={newChalBadge}
                  onChange={(e) => setNewChalBadge(e.target.value)}
                  placeholder="e.g. Master E-Waste Guardian"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs mt-2"
              >
                Launch Challenge to Community
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Active Community Sprints ({challenges.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {challenges.map((chal) => (
                <div key={chal.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{chal.title}</span>
                    <p className="text-slate-500 text-[11px] line-clamp-1">{chal.description}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      +{chal.pointsReward} pts • Target: {chal.targetCount} items • {chal.participantsCount} participants
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteChallenge(chal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
