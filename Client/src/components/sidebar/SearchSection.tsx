// components/sidebar/SearchSection.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/store/sidebarStore";
import { useMapStore } from "@/store/mapStore";
import useDebounce from "@/hooks/useDebounce";
import { Separator } from "@/components/ui/separator";

interface Station {
  stationDesc: string;
  stationCode: string;
  latitude: number;
  longitude: number;
  lineName?: string;
}

interface SearchSectionProps {
  stations: Station[];
}

export default function SearchSection({ stations }: SearchSectionProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const setSelectedStation = useSidebarStore(
    (state) => state.setSelectedStation,
  );
  const setMapCenter = useMapStore((state) => state.setMapCenter);
  const flyToStation = useMapStore((state) => state.flyToStation);
  const selectedStation = useSidebarStore((state) => state.selectedStation);
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  const filteredStations = Array.isArray(stations)
    ? stations.filter((station) =>
        station.stationDesc
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (debouncedSearch && filteredStations.length === 1) {
      // 只在当前未选中时 set，避免死循环
      if (
        !selectedStation ||
        selectedStation.stationCode !== filteredStations[0].stationCode
      ) {
        setSelectedStation(filteredStations[0]);
        setSidebarOpen(true);
      }
    }
    // 不依赖 filteredStations，避免死循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, setSelectedStation, selectedStation]);

  return (
    <div className="space-y-2 p-3">
      <Input
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Separator />
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {filteredStations.length > 0 ? (
          filteredStations.map((station) => (
            <div
              key={station.stationCode}
              className="cursor-pointer rounded-md p-2 hover:bg-muted"
              onClick={() => {
                setSelectedStation({
                  ...station,
                  lineName: station.lineName || "DART",
                });
                flyToStation(station);
                setSidebarOpen(true);
              }}
            >
              <div className="font-medium">{station.stationDesc}</div>
              <div className="text-sm text-muted-foreground">
                {station.latitude.toFixed(5)}, {station.longitude.toFixed(5)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No matching stations.
          </div>
        )}
      </div>
    </div>
  );
}
