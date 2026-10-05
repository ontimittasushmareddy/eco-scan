import { 
  ScanResult, 
  UserProfile, 
  DropOffLocation, 
  Challenge, 
  LeaderboardEntry, 
  ImpactStats, 
  RecommendationTip, 
  UserActionLog,
  WasteCategory,
  ActionType 
} from '../types';

export const api = {
  async scanItem(params: { 
    imageBase64?: string; 
    mimeType?: string; 
    sampleId?: string; 
    textPrompt?: string 
  }): Promise<{ success: boolean; result: ScanResult; warning?: string }> {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Scan request failed');
    return res.json();
  },

  async confirmAction(data: {
    scanId?: string;
    itemName: string;
    category: WasteCategory;
    chosenAction: ActionType;
    actionTitle: string;
    pointsEarned: number;
    co2SavedKg?: number;
    wasteDivertedKg?: number;
    notes?: string;
  }): Promise<{ 
    success: boolean; 
    log: UserActionLog; 
    user: UserProfile; 
    levelUp: boolean; 
    unlockedBadges: string[] 
  }> {
    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to confirm action');
    return res.json();
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    const data = await res.json();
    return data.user;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    return data.user;
  },

  async getLocations(filters?: { category?: string; type?: string }): Promise<DropOffLocation[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.type) params.append('type', filters.type);

    const res = await fetch(`/api/locations?${params.toString()}`);
    const data = await res.json();
    return data.locations;
  },

  async addLocation(location: Partial<DropOffLocation>): Promise<DropOffLocation> {
    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });
    const data = await res.json();
    return data.location;
  },

  async deleteLocation(id: string): Promise<boolean> {
    const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getChallenges(): Promise<Challenge[]> {
    const res = await fetch('/api/challenges');
    const data = await res.json();
    return data.challenges;
  },

  async joinChallenge(id: string): Promise<Challenge> {
    const res = await fetch(`/api/challenges/${id}/join`, { method: 'POST' });
    const data = await res.json();
    return data.challenge;
  },

  async addChallenge(challenge: Partial<Challenge>): Promise<Challenge> {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challenge),
    });
    const data = await res.json();
    return data.challenge;
  },

  async deleteChallenge(id: string): Promise<boolean> {
    const res = await fetch(`/api/challenges/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getLeaderboard(type: 'global' | 'campus' | 'school' | 'workplace'): Promise<LeaderboardEntry[]> {
    const res = await fetch(`/api/leaderboard?type=${type}`);
    const data = await res.json();
    return data.leaderboard;
  },

  async getImpactStats(): Promise<ImpactStats> {
    const res = await fetch('/api/impact');
    const data = await res.json();
    return data.stats;
  },

  async getRecommendations(): Promise<RecommendationTip[]> {
    const res = await fetch('/api/recommendations');
    const data = await res.json();
    return data.recommendations;
  },

  async getHistory(): Promise<UserActionLog[]> {
    const res = await fetch('/api/history');
    const data = await res.json();
    return data.logs;
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    return data.analytics;
  },
};
