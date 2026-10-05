export type WasteCategory = 
  | 'electronics'
  | 'batteries'
  | 'plastic'
  | 'glass'
  | 'metal'
  | 'paper'
  | 'textiles'
  | 'medicines'
  | 'food_containers'
  | 'general_waste';

export type ActionType = 'reuse' | 'donate' | 'upcycle' | 'recycle' | 'safe_disposal';

export interface SmartActionDetail {
  title: string;
  description: string;
  points: number;
  difficulty?: 'Easy' | 'Moderate' | 'Advanced';
  estimatedMinutes?: number;
  locationTypeNeeded?: string;
  tags?: string[];
}

export interface ScanResult {
  id: string;
  userId: string;
  itemName: string;
  material: string;
  category: WasteCategory;
  confidence: number; // 0 - 100
  isUncertain?: boolean;
  uncertaintyReason?: string;
  recyclability: 'High' | 'Moderate' | 'Low' | 'Special Handling Required' | 'Non-recyclable';
  recommendedAction: ActionType;
  recommendedSteps: string[];
  safetyInstructions?: string;
  hazardLevel?: 'None' | 'Low' | 'Medium' | 'High';
  actions: {
    reuse?: SmartActionDetail;
    donate?: SmartActionDetail;
    upcycle?: SmartActionDetail;
    recycle?: SmartActionDetail;
    safe_disposal?: SmartActionDetail;
  };
  co2SavingsEstimateKg: number;
  wasteDivertedEstimateKg: number;
  imageUrl?: string;
  scannedAt: string;
}

export interface UserActionLog {
  id: string;
  userId: string;
  scanId: string;
  itemName: string;
  category: WasteCategory;
  chosenAction: ActionType;
  actionTitle: string;
  pointsEarned: number;
  co2SavedKg: number;
  wasteDivertedKg: number;
  confirmedAt: string;
  notes?: string;
}

export interface DropOffLocation {
  id: string;
  name: string;
  type: 'Recycling Center' | 'E-Waste Hub' | 'Donation Center' | 'Battery Drop-Off' | 'Textile Collection' | 'Hazardous Disposal';
  categoryKey: 'recycling' | 'e_waste' | 'donation' | 'batteries' | 'textiles' | 'safe_disposal';
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
  supportedCategories: WasteCategory[];
  isOpen: boolean;
  hours: string;
  phone?: string;
  rating?: number;
  acceptsPublic: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  targetCategory?: WasteCategory | 'all';
  targetAction?: ActionType | 'all';
  pointsReward: number;
  badgeReward?: string;
  currentProgress?: number;
  joined?: boolean;
  completed?: boolean;
  participantsCount: number;
  daysRemaining: number;
  categoryBadge: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'milestone' | 'category' | 'community' | 'streak';
  requirement: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  organization?: string;
  orgType?: 'campus' | 'school' | 'workplace' | 'community';
  ecoPoints: number;
  ecoLevel: 'Eco Beginner' | 'Green Starter' | 'Eco Hero' | 'Sustainability Champion' | 'Planet Protector';
  nextLevelPoints: number;
  itemsRecycled: number;
  itemsReused: number;
  itemsDonated: number;
  itemsSafelyDisposed: number;
  totalWasteDivertedKg: number;
  totalCo2AvoidedKg: number;
  badges: Badge[];
  streakDays: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  organization?: string;
  ecoPoints: number;
  itemsDiverted: number;
  co2SavedKg: number;
  badge: string;
}

export interface RecommendationTip {
  id: string;
  title: string;
  description: string;
  type: 'habit' | 'drop_off' | 'challenge' | 'upcycle';
  iconName: string;
  actionText?: string;
  actionTarget?: string;
}

export interface ImpactStats {
  totalItems: number;
  recycled: number;
  reused: number;
  donated: number;
  safelyDisposed: number;
  totalWasteDivertedKg: number;
  totalCo2AvoidedKg: number;
  treesEquivalent: number;
  kwhEnergySaved: number;
  litersWaterSaved: number;
  weeklyTrend: { day: string; count: number; points: number }[];
  monthlyBreakdown: { month: string; divertedKg: number; co2Kg: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
}
