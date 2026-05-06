import { create } from 'zustand';

interface AppState {
  selectedDzongkhag: string;
  setDzongkhag: (val: string) => void;
}

// In Zustand 4+, 'create' needs the type passed differently if using standard TS
export const useStore = create<AppState>()((set) => ({
  selectedDzongkhag: 'Thimphu',
  setDzongkhag: (val) => set({ selectedDzongkhag: val }),
}));
