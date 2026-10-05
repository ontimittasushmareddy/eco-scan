import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, ScanResult, DropOffLocation, ActionType, WasteCategory } from '../types';
import { api } from '../services/api';

export type NavView = 'landing' | 'scanner' | 'impact' | 'locations' | 'community' | 'history' | 'profile' | 'admin';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  scanResult?: ScanResult;
  chosenAction?: ActionType;
  actionTitle?: string;
  points?: number;
  co2Saved?: number;
  wasteDiverted?: number;
}

interface AppContextType {
  user: UserProfile | null;
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  activeScan: ScanResult | null;
  setActiveScan: (scan: ScanResult | null) => void;
  confirmModal: ConfirmModalState;
  openConfirmAction: (scan: ScanResult, action: ActionType) => void;
  closeConfirmAction: () => void;
  executeConfirmAction: (notes?: string) => Promise<void>;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  refreshUserData: () => Promise<void>;
  filterLocationCategory: WasteCategory | null;
  setFilterLocationCategory: (cat: WasteCategory | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<NavView>('landing');
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [filterLocationCategory, setFilterLocationCategory] = useState<WasteCategory | null>(null);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // fallback
    }
  };

  const refreshUserData = async () => {
    try {
      const u = await api.getUserProfile();
      setUser(u);
    } catch (e) {
      console.error('Failed to load user profile', e);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const openConfirmAction = (scan: ScanResult, action: ActionType) => {
    const actionDetail = scan.actions[action];
    const points = actionDetail?.points || 20;
    const actionTitle = actionDetail?.title || `Chose ${action} for ${scan.itemName}`;
    
    setConfirmModal({
      isOpen: true,
      scanResult: scan,
      chosenAction: action,
      actionTitle,
      points,
      co2Saved: scan.co2SavingsEstimateKg || 0.8,
      wasteDiverted: scan.wasteDivertedEstimateKg || 0.25,
    });
  };

  const closeConfirmAction = () => {
    setConfirmModal({ isOpen: false });
  };

  const executeConfirmAction = async (notes?: string) => {
    if (!confirmModal.scanResult || !confirmModal.chosenAction) return;

    try {
      const res = await api.confirmAction({
        scanId: confirmModal.scanResult.id,
        itemName: confirmModal.scanResult.itemName,
        category: confirmModal.scanResult.category,
        chosenAction: confirmModal.chosenAction,
        actionTitle: confirmModal.actionTitle || 'Completed sustainable circular action',
        pointsEarned: confirmModal.points || 20,
        co2SavedKg: confirmModal.co2Saved,
        wasteDivertedKg: confirmModal.wasteDiverted,
        notes,
      });

      setUser(res.user);
      triggerConfetti();

      addToast({
        type: 'success',
        title: `+${confirmModal.points} EcoPoints Awarded!`,
        message: `Awesome job! Diverted ${confirmModal.wasteDiverted} kg and saved ~${confirmModal.co2Saved} kg CO₂.`,
      });

      if (res.levelUp) {
        addToast({
          type: 'info',
          title: `Level Up! 🎉`,
          message: `Congratulations! You reached the "${res.user.ecoLevel}" milestone.`,
        });
      }

      if (res.unlockedBadges && res.unlockedBadges.length > 0) {
        res.unlockedBadges.forEach(badge => {
          addToast({
            type: 'info',
            title: `New Badge Unlocked: ${badge}`,
            message: `Check your profile showcase to admire your new eco-trophy!`,
          });
        });
      }

      closeConfirmAction();
      setCurrentView('impact');
    } catch (e: any) {
      addToast({
        type: 'error',
        title: 'Action Error',
        message: e?.message || 'Could not record action.',
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        setCurrentView,
        activeScan,
        setActiveScan,
        confirmModal,
        openConfirmAction,
        closeConfirmAction,
        executeConfirmAction,
        toasts,
        addToast,
        removeToast,
        triggerConfetti,
        refreshUserData,
        filterLocationCategory,
        setFilterLocationCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
