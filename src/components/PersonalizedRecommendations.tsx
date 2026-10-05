import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  MapPin, 
  Target, 
  Scissors, 
  ArrowRight, 
  Droplet, 
  Zap, 
  Trophy 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { RecommendationTip } from '../types';

export const PersonalizedRecommendations: React.FC = () => {
  const { setCurrentView } = useApp();
  const [tips, setTips] = useState<RecommendationTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const data = await api.getRecommendations();
      setTips(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <Droplet className="w-5 h-5 text-emerald-600" />;
      case 'drop_off':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'challenge':
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'upcycle':
        return <Scissors className="w-5 h-5 text-purple-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-emerald-600" />;
    }
  };

  if (tips.length === 0 && !loading) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              AI Personalized Circular Insights
            </h3>
            <p className="text-xs text-slate-500">
              Generated from your recent scans & household waste trends
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          Continuous Learning
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {getIcon(tip.type)}
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">
                  {tip.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tip.description}
              </p>
            </div>

            {tip.actionText && (
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-end">
                <button
                  onClick={() => {
                    if (tip.actionTarget === '/locations') setCurrentView('locations');
                    else if (tip.actionTarget === '/community') setCurrentView('community');
                    else setCurrentView('scanner');
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <span>{tip.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
