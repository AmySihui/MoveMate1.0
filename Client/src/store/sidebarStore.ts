import { create } from "zustand";

interface Station {
  stationDesc: string;
  stationCode: string;
  latitude: number;
  longitude: number;
  lineName?: string;
}

interface SidebarStore {
  selectedStation: Station | null;
  setSelectedStation: (station: Station | null) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  selectedStation: null,
  setSelectedStation: (station) => set({ selectedStation: station }),
}));
