import React, { useState } from 'react';
import { 
  Recycle, 
  Camera, 
  BarChart3, 
  MapPin, 
  Users, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useApp, NavView } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: <Recycle className="w-4 h-4" /> },
    { id: 'scanner', label: 'AI Scanner', icon: <Camera className="w-4 h-4" />, badge: 'AI' },
    { id: 'impact', label: 'My Impact', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'locations', label: 'Drop-off Centers', icon: <MapPin className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" />, badge: 'New' },
    { id: 'history', label: 'Activity', icon: <History className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: NavView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Recycle className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Eco<span className="text-emerald-600">Scan</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-100 text-emerald-800 rounded-md">
                  Hackathon
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
                E-Waste & Circular Lifecycle Tracker
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Points, Scan CTA, Profile */}
          <div className="flex items-center gap-3">
            {/* EcoPoints Badge */}
            {user && (
              <div 
                onClick={() => handleNavClick('impact')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full cursor-pointer hover:border-emerald-300 transition-colors shadow-xs"
                title="Your Total EcoPoints"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold">
                  ⚡
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-emerald-900">{user.ecoPoints}</span>
                  <span className="text-[10px] text-emerald-700 ml-1 font-medium">pts</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 font-semibold bg-emerald-100 text-emerald-800 rounded-full hidden md:inline">
                  {user.ecoLevel}
                </span>
              </div>
            )}

            {/* Quick Action: Scan Button */}
            <button
              onClick={() => handleNavClick('scanner')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Item</span>
            </button>

            {/* Profile Avatar Pill */}
            {user && (
              <button
                onClick={() => handleNavClick('profile')}
                className={`p-1 rounded-xl border transition-all flex items-center gap-2 ${
                  currentView === 'profile'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
                title="View Profile & Badges"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {user && (
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center justify-between p-3 mb-2 bg-emerald-50/70 border border-emerald-100 rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="font-semibold text-sm text-slate-900">{user.name}</div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {user.ecoLevel} • {user.ecoPoints} pts
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
