import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Award, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  Clock, 
  School, 
  Building2, 
  Globe2,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Challenge, LeaderboardEntry } from '../types';

export const CommunityView: React.FC = () => {
  const { user, setCurrentView, addToast, triggerConfetti } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'campus' | 'school' | 'workplace'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityData();
  }, [leaderboardType]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const [chalData, leadData] = await Promise.all([
        api.getChallenges(),
        api.getLeaderboard(leaderboardType),
      ]);
      setChallenges(chalData);
      setLeaderboard(leadData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const updated = await api.joinChallenge(challengeId);
      setChallenges((prev) => prev.map((c) => (c.id === challengeId ? updated : c)));
      triggerConfetti();
      addToast({
        type: 'success',
        title: `Challenge Joined: ${updated.title}!`,
        message: `Complete target actions to claim +${updated.pointsReward} bonus EcoPoints.`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            Social Circular Movement
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Leaderboards & Eco-Challenges
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Compete with students, colleagues, and eco-innovators. Join collective challenges to amplify your community's diversion impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('scanner')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Scan to Earn Points
          </button>
        </div>
      </div>

      {/* Sustainability Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Active Circular Challenges
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Resetting in October 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {challenges.map((chal) => {
            const isJoined = chal.joined;
            const progress = chal.currentProgress || 0;
            const target = chal.targetCount;
            const pct = Math.min(100, Math.round((progress / target) * 100));

            return (
              <div
                key={chal.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {chal.categoryBadge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {chal.daysRemaining} days left
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {chal.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {chal.description}
                  </p>

                  {/* Progress Bar if Joined */}
                  {isJoined ? (
                    <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">Your Progress:</span>
                        <span className="text-emerald-700">{progress} / {target} items ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {chal.completed ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Challenge Completed! Reward claimed.
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500">
                          {target - progress} more items needed to finish
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      +{chal.pointsReward} pts
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {chal.participantsCount} participants
                    </span>
                  </div>

                  {isJoined ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-default"
                    >
                      {chal.completed ? 'Completed' : 'Participating'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(chal.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">
                Eco-Warrior Leaderboards
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by verified items diverted and accumulated EcoPoints
            </p>
          </div>

          {/* Leaderboard Category Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setLeaderboardType('global')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                leaderboardType === 'global' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Global
            </button>
            <button
              onClick={() => setLeaderboardType('campus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                leaderboardType === 'campus' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              University / Campus
            </button>
            <button
              onClick={() => setLeaderboardType('school')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                leaderboardType === 'school' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              High School
            </button>
            <button
              onClick={() => setLeaderboardType('workplace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                leaderboardType === 'workplace' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Workplace
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Innovator</th>
                <th className="py-3 px-4">Affiliation / Org</th>
                <th className="py-3 px-4">Items Diverted</th>
                <th className="py-3 px-4">CO₂ Prevented</th>
                <th className="py-3 px-4 text-right">Total EcoPoints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((entry) => {
                const isUser = user && entry.userId === user.id;

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      isUser ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {entry.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center mx-auto text-xs">
                          🥇
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center mx-auto text-xs">
                          🥈
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-900 font-extrabold flex items-center justify-center mx-auto text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="font-bold text-slate-600">#{entry.rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatarUrl}
                          alt={entry.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {entry.name}
                            {isUser && (
                              <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] rounded-sm uppercase font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-700">{entry.badge}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {entry.organization || 'Independent'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {entry.itemsDiverted} items
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      ~{entry.co2SavedKg} kg
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-emerald-800 text-sm">
                        {entry.ecoPoints}
                      </span>
                      <span className="text-[10px] text-emerald-600 ml-1">pts</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
