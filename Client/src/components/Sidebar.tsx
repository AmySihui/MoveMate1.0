// components/Sidebar.tsx
import WeatherSection from "./sidebar/WeatherSection";
import SearchSection from "./sidebar/SearchSection";
import EventSection from "./sidebar/EventSection";
import AddEventForm from "./sidebar/AddEventForm";
import { useSidebarStore } from "@/store/sidebarStore";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface SidebarProps {
  stations: {
    stationDesc: string;
    stationCode: string;
    latitude: number;
    longitude: number;
    lineName?: string;
  }[];
  className?: string;
}

export default function Sidebar({ stations, className }: SidebarProps) {
  const { selectedStation } = useSidebarStore();

  return (
    <aside
      className={`flex h-full w-full flex-col bg-white text-black ${className || ""}`}
    >
      <Card className="flex flex-col space-y-4 overflow-y-auto border-none bg-white p-3 text-black shadow-none">
        <WeatherSection />
        <Separator />
        <SearchSection stations={stations} />
        <Separator />
        <EventSection />
        <Separator />
        {selectedStation && typeof selectedStation === "object" && (
          <AddEventForm
            station={{
              stationDesc: selectedStation.stationDesc,
              stationCode: selectedStation.stationCode,
              latitude: selectedStation.latitude,
              longitude: selectedStation.longitude,
              lineName: selectedStation.lineName ?? "DART",
            }}
            onSubmit={() => {}}
          />
        )}
      </Card>
    </aside>
  );
}
