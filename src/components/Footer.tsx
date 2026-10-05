import React from 'react';
import { Recycle, Heart, Shield, Globe, Award, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Eco<span className="text-emerald-400">Scan</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                E-Waste & Circular Tracker
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering consumers, universities, and cities to make instantaneous, responsible circular waste decisions. Transform uncertainty into actionable next steps: Reuse, Donate, Upcycle, Recycle, or Safe Disposal.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-400" /> Safe Hazardous Guidance
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Powered by Gemini AI
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-400" /> Zero-Landfill Goal
              </span>
            </div>
          </div>

          {/* Quick Circular Hubs */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-xs">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => setCurrentView('scanner')} className="hover:text-emerald-400 transition-colors">
                  AI Item Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('impact')} className="hover:text-emerald-400 transition-colors">
                  My Eco Impact & CO₂ Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('locations')} className="hover:text-emerald-400 transition-colors">
                  Nearby Drop-off Centers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('community')} className="hover:text-emerald-400 transition-colors">
                  Community Leaderboard & Challenges
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('history')} className="hover:text-emerald-400 transition-colors">
                  Personal Activity Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-xs">
              Material Categories
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Electronics & E-Waste',
                'Lithium & Alkaline Batteries',
                'Plastics (PET / HDPE)',
                'Textiles & Apparel',
                'Pharmaceutical Blister Packs',
                'Glass Bottles',
                'Metals & Cans',
                'Paper & Cardboard',
              ].map(cat => (
                <span key={cat} className="px-2 py-1 text-[11px] rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {cat}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the Sustainable Future Hackathon 2026.
          </div>
          <div className="flex items-center gap-4">
            <span>Clean Tech • Circular Economy • Verified Impact</span>
            <button 
              onClick={() => setCurrentView('admin')} 
              className="text-slate-400 hover:text-emerald-400 underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
