import { create } from 'zustand';

interface TabBarStore {
  isVisible: boolean;
  isShow: boolean;
  isStatic: boolean;
  setIsVisible: (visible: boolean) => void;
  setIsShow: (show: boolean) => void;
  setIsStatic: (val: boolean) => void;
}

export const useTabBarStore = create<TabBarStore>((set) => ({
  isShow: true,
  isVisible: true,
  isStatic: true,
  setIsShow: (show) => set({ isShow: show }),
  setIsVisible: (visible) => set({ isVisible: visible }),
  setIsStatic: (val) => set({ isStatic: val }),
}));