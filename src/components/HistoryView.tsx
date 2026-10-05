import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Recycle, 
  RotateCcw, 
  HeartHandshake, 
  Scissors, 
  AlertOctagon, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  Download,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { UserActionLog, ActionType, WasteCategory } from '../types';

export const HistoryView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [logs, setLogs] = useState<UserActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLogDetail, setActiveLogDetail] = useState<UserActionLog | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const actionMeta: Record<ActionType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    recycle: {
      label: 'Recycled',
      icon: <Recycle className="w-4 h-4 text-emerald-600" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    reuse: {
      label: 'Reused',
      icon: <RotateCcw className="w-4 h-4 text-blue-600" />,
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
    },
    donate: {
      label: 'Donated',
      icon: <HeartHandshake className="w-4 h-4 text-amber-600" />,
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
    },
    upcycle: {
      label: 'Upcycled',
      icon: <Scissors className="w-4 h-4 text-purple-600" />,
      color: 'text-purple-700',
      bg: 'bg-purple-50 border-purple-200',
    },
    safe_disposal: {
      label: 'Hazardous Disposal',
      icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
      color: 'text-rose-700',
      bg: 'bg-rose-50 border-rose-200',
    },
  };

  const filteredLogs = logs.filter((log) => {
    const matchAction = selectedActionFilter === 'all' || log.chosenAction === selectedActionFilter;
    const matchCategory = selectedCategoryFilter === 'all' || log.category === selectedCategoryFilter;
    const matchSearch =
      log.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchAction && matchCategory && matchSearch;
  });

  const totalPointsEarned = logs.reduce((acc, curr) => acc + curr.pointsEarned, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            Immutable Circular Log
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Activity History & Disposals
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete historical timeline of all scanned items, chosen circular paths, and awarded EcoPoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <span className="text-[10px] text-emerald-700 font-semibold uppercase block">Lifetime Earned</span>
            <span className="text-lg font-extrabold text-emerald-900">+{totalPointsEarned} pts</span>
          </div>
          <button
            onClick={() => setCurrentView('scanner')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Scan New Item
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, notes, depots..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Action Filter */}
          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Actions</option>
            <option value="recycle">Recycle</option>
            <option value="reuse">Reuse</option>
            <option value="donate">Donate</option>
            <option value="upcycle">Upcycle</option>
            <option value="safe_disposal">Safe Disposal</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics & E-Waste</option>
            <option value="batteries">Batteries & Cells</option>
            <option value="plastic">Plastics</option>
            <option value="textiles">Textiles & Apparel</option>
            <option value="glass">Glass</option>
            <option value="medicines">Medicines</option>
          </select>
        </div>

      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading activity timeline...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">No records found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or scan a new item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Item Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Action Chosen</th>
                  <th className="py-3.5 px-4">Impact Diverted</th>
                  <th className="py-3.5 px-4 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const meta = actionMeta[log.chosenAction] || actionMeta.recycle;
                  const dateFormatted = new Date(log.confirmedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeFormatted = new Date(log.confirmedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setActiveLogDetail(log)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        <div className="font-medium text-slate-800">{dateFormatted}</div>
                        <div className="text-[10px] text-slate-400">{timeFormatted}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {log.itemName}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {log.actionTitle}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {log.category.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.color}`}>
                          {meta.icon}
                          {meta.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        <span className="font-semibold text-slate-800">{log.wasteDivertedKg} kg</span> diverted
                        <span className="text-slate-400 text-[10px] block">~{log.co2SavedKg} kg CO₂</span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200">
                          +{log.pointsEarned} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {activeLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Record #{activeLogDetail.id}
              </span>
              <button
                onClick={() => setActiveLogDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {activeLogDetail.itemName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{activeLogDetail.actionTitle}</p>

            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Action:</span>
                <span className="font-bold capitalize">{activeLogDetail.chosenAction.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold capitalize">{activeLogDetail.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Points Awarded:</span>
                <span className="font-extrabold text-emerald-700">+{activeLogDetail.pointsEarned} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waste Diverted:</span>
                <span className="font-bold">{activeLogDetail.wasteDivertedKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CO₂ Avoided:</span>
                <span className="font-bold">~{activeLogDetail.co2SavedKg} kg CO₂ eq</span>
              </div>
              {activeLogDetail.notes && (
                <div className="pt-2 border-t border-slate-200 text-slate-700 italic">
                  Note: "{activeLogDetail.notes}"
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveLogDetail(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
