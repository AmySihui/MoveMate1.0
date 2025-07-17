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

  const filteredStations = Array.isArray(stations)
    ? stations.filter((station) =>
        station.stationDesc
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (!debouncedSearch) setSelectedStation(null);
  }, [debouncedSearch, setSelectedStation]);

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
                setSelectedStation(station);
                flyToStation(station);
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
