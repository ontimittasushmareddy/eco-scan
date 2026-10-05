import React, { useState } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Leaf, 
  X, 
  Recycle, 
  HeartHandshake, 
  Scissors, 
  RotateCcw, 
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActionType } from '../types';

export const ActionConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirmAction, executeConfirmAction } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  if (!confirmModal.isOpen || !confirmModal.scanResult || !confirmModal.chosenAction) {
    return null;
  }

  const { scanResult, chosenAction, actionTitle, points, co2Saved, wasteDiverted } = confirmModal;

  const actionMeta: Record<ActionType, { name: string; color: string; bg: string; icon: React.ReactNode }> = {
    reuse: {
      name: 'Reuse',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      icon: <RotateCcw className="w-5 h-5 text-blue-600" />,
    },
    donate: {
      name: 'Donate',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      icon: <HeartHandshake className="w-5 h-5 text-amber-600" />,
    },
    upcycle: {
      name: 'Upcycle',
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      icon: <Scissors className="w-5 h-5 text-purple-600" />,
    },
    recycle: {
      name: 'Recycle',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: <Recycle className="w-5 h-5 text-emerald-600" />,
    },
    safe_disposal: {
      name: 'Safe Disposal',
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
    },
  };

  const meta = actionMeta[chosenAction];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await executeConfirmAction(notes);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${meta.bg}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs">
              {meta.icon}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Confirmation
              </span>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                Great choice! You selected <span className={meta.color}>{meta.name}</span>
              </h3>
            </div>
          </div>
          <button
            onClick={closeConfirmAction}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Item Recap Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            {scanResult.imageUrl ? (
              <img
                src={scanResult.imageUrl}
                alt={scanResult.itemName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Recycle className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 uppercase">
                {scanResult.category.replace('_', ' ')}
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-1 truncate">
                {scanResult.itemName}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">{actionTitle}</p>
            </div>
          </div>

          {/* Reward Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Reward</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-700">+{points}</div>
              <div className="text-[11px] text-emerald-800 font-medium">EcoPoints</div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-100 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-0.5">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Diverted</span>
              </div>
              <div className="text-xl font-extrabold text-teal-700">{wasteDiverted} kg</div>
              <div className="text-[11px] text-teal-800 font-medium">From Landfill</div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-100 text-center">
              <div className="flex items-center justify-center gap-1 text-sky-600 mb-0.5">
                <span className="text-xs font-bold uppercase">CO₂ Saved</span>
              </div>
              <div className="text-xl font-extrabold text-sky-700">~{co2Saved} kg</div>
              <div className="text-[11px] text-sky-800 font-medium">Emissions Cut</div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add a quick note or drop-off location (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dropped at GreenTech Metro Hub or repurposed into seedling pot"
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirmAction}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Awarding Points...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Claim +{points} pts</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
