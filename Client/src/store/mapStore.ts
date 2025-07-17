import { create } from "zustand";
import mapboxgl from "mapbox-gl";

interface Station {
  stationDesc: string;
  latitude: number;
  longitude: number;
}

interface MapStore {
  mapRef: mapboxgl.Map | null;
  stations: Station[];
  selectedStation: Station | null;
  setMapRef: (map: mapboxgl.Map) => void;
  setStations: (stations: Station[]) => void;
  selectStation: (station: Station | null) => void;
  flyToStation: (station: Station) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  mapRef: null,
  stations: [],
  selectedStation: null,
  setMapRef: (map) => set({ mapRef: map }),
  setStations: (stations) => set({ stations }),
  selectStation: (station) => {
    set({ selectedStation: station });
    if (station) get().flyToStation(station);
  },
  flyToStation: (station) => {
    const map = get().mapRef;
    if (map) {
      map.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 14,
        speed: 1.2,
      });
      map.setFilter("dart-stations-highlight", [
        "==",
        "stationDesc",
        station.stationDesc,
      ]);
    }
  },
  mapCenter: [-6.2603, 53.3498], // 默认中心
  setMapCenter: (center) => set({ mapCenter: center }),
}));
