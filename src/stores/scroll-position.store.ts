import { create } from 'zustand';

interface State {
  scrollY: number;
  isScrollingDown: boolean;
  lastScrollY: number;
  currentRouteKey: string;
  routeSpecificPositions: Record<string, { 
    scrollY: number;
    lastScrollY: number;
    isScrollingDown: boolean
  }>;
}

type Actions = {
  setScrollY: (value: number, routeKey?: string) => void;
  setIsScrollingDown: (value: boolean) => void;
  updateScrollDirection: (currentScrollY: number, routeKey?: string) => boolean;
  resetScroll: () => void;
  setCurrentRouteKey: (routeKey: string) => void;
  getRouteState: (routeKey: string) => {
    scrollY: number;
    lastScrollY: number;
    isScrollingDown: boolean;
  };
  getCurrentRouteState: () => {
    scrollY: number;
    lastScrollY: number;
    isScrollingDown: boolean;
  };
};

const initialState: State = {
  scrollY: 0,
  isScrollingDown: false,
  lastScrollY: 0,
  currentRouteKey: '',
  // currentRouteKey: 'home',
  routeSpecificPositions: {},
};

export const useScrollPositionStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setScrollY: (value, routeKey) => {
    const currentKey = routeKey || get().currentRouteKey;
    
    set((state) => {
      // Get existing route state or create a new one
      const currentRouteState = state.routeSpecificPositions[currentKey] || {
        scrollY: 0,
        lastScrollY: 0,
        isScrollingDown: false,
      };
      
      return {
        scrollY: value, // Keep global for backward compatibility
        routeSpecificPositions: {
          ...state.routeSpecificPositions,
          [currentKey]: {
            ...currentRouteState,
            scrollY: value,
          },
        },
      };
    });
  },
  
  setIsScrollingDown: (value) => set({ isScrollingDown: value }),
  
  updateScrollDirection: (currentScrollY, routeKey) => {
    const currentKey = routeKey || get().currentRouteKey;
    const state = get();
    const routeState = state.routeSpecificPositions[currentKey] || { 
      scrollY: 0, 
      lastScrollY: 0, 
      isScrollingDown: false, 
    };
    
    // Calculate if scrolling down but don't update state yet
    const newIsScrollingDown = currentScrollY > routeState.lastScrollY;
    
    // Only update state if the direction has actually changed
    if (newIsScrollingDown !== routeState.isScrollingDown) {
      set({
        isScrollingDown: newIsScrollingDown,
        routeSpecificPositions: {
          ...state.routeSpecificPositions,
          [currentKey]: {
            ...routeState,
            lastScrollY: currentScrollY,
            isScrollingDown: newIsScrollingDown,
          },
        },
      });
    }
    else if (Math.abs(currentScrollY - routeState.lastScrollY) > 10) {
      // Only update lastScrollY occasionally to reduce update frequency
      // This prevents constant state updates while maintaining scroll direction tracking
      set({
        routeSpecificPositions: {
          ...state.routeSpecificPositions,
          [currentKey]: {
            ...routeState,
            lastScrollY: currentScrollY,
          },
        },
      });
    }
    
    return newIsScrollingDown;
  },
  
  setCurrentRouteKey: (routeKey) => set({ currentRouteKey: routeKey }),

  getRouteState: (routeKey: string) => get().routeSpecificPositions[routeKey] || {
    scrollY: 0,
    lastScrollY: 0,
    isScrollingDown: false,
  },
  
  getCurrentRouteState: () => {
    const { currentRouteKey } = get();
    return get().getRouteState(currentRouteKey);
  },
  
  resetScroll: () => set(initialState),
})); 