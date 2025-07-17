import WeatherSection from "./sidebar/WeatherSection";
import SearchSection from "./sidebar/SearchSection";
import EventSection from "./sidebar/EventSection";
import AddEventForm from "./sidebar/AddEventForm";
import DartRealtimeSection from "./sidebar/DartRealtimeSection";
import LuasRealtimeSection from "./sidebar/LuasRealtimeSection";
import AnnouncementSection from "./sidebar/AnnouncementSection";
import { useSidebarStore } from "@/store/sidebarStore";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useRef } from "react";

export default function Sidebar({
  stations,
  className,
}: {
  stations: any[];
  className?: string;
}) {
  const { selectedStation } = useSidebarStore();
  const refetchEvents = useRef<() => void>(() => {});

  return (
    <aside
      className={`flex h-full w-full flex-col bg-white text-black ${className || ""}`}
    >
      <Card className="flex flex-col space-y-4 overflow-y-auto border-none bg-white p-3 text-black shadow-none">
        <WeatherSection />
        <Separator />
        <SearchSection stations={stations} />
        <Separator />
        {!selectedStation && <AnnouncementSection />}
        {selectedStation && (
          <>
            <EventSection
              station={selectedStation}
              onRefetch={(fn) => (refetchEvents.current = fn)}
            />
            <Separator />
            {selectedStation.lineName === "DART" && (
              <DartRealtimeSection stationDesc={selectedStation.stationDesc} />
            )}
            {selectedStation.lineName === "LUAS" && (
              <LuasRealtimeSection stationDesc={selectedStation.stationDesc} />
            )}

            <AddEventForm
              station={selectedStation}
              onSubmit={() => {
                refetchEvents.current();
              }}
            />
          </>
        )}
      </Card>
    </aside>
  );
}
