import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSidebarStore } from "@/store/sidebarStore";
import WeatherSection from "./sidebar/WeatherSection";
import SearchSection from "./sidebar/SearchSection";
import EventSection from "./sidebar/EventSection";
import AddEventForm from "./sidebar/AddEventForm";
import DartRealtimeSection from "./sidebar/DartRealtimeSection";
import LuasRealtimeSection from "./sidebar/LuasRealtimeSection";
import AnnouncementSection from "./sidebar/AnnouncementSection";
import { useRef } from "react";

interface SidebarProps {
  stations: any[];
  show: boolean;
}

export default function Sidebar({ stations, show }: SidebarProps) {
  const { selectedStation } = useSidebarStore();
  const refetchEvents = useRef<() => void>(() => {});

  if (!show) return null;

  return (
    <aside className="absolute right-4 top-16 z-40 flex w-80 flex-col rounded-xl bg-white/90 p-2 shadow-xl">
      <Tabs defaultValue="events" className="flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-3 p-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="realtime">Realtime</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="flex flex-col">
          <Card className="flex flex-col overflow-hidden p-3 shadow-none">
            <SearchSection stations={stations} />
            <Separator />
            <div className="flex-1 space-y-3 overflow-y-auto">
              {!selectedStation && <AnnouncementSection />}
              {selectedStation && (
                <EventSection
                  station={selectedStation}
                  onRefetch={(fn) => (refetchEvents.current = fn)}
                />
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="flex flex-col">
          <Card className="flex flex-col overflow-hidden p-3 shadow-none">
            <div className="flex-1 overflow-y-auto">
              {selectedStation ? (
                <AddEventForm
                  station={selectedStation}
                  onSubmit={() => refetchEvents.current()}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Please select a station to upload an event.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="flex flex-col">
          <Card className="flex flex-col overflow-hidden p-3 shadow-none">
            <div className="flex flex-1 flex-col space-y-3 overflow-y-auto">
              <WeatherSection />
              {selectedStation?.lineName === "DART" && (
                <DartRealtimeSection
                  stationDesc={selectedStation.stationDesc}
                />
              )}
              {selectedStation?.lineName === "LUAS" && (
                <LuasRealtimeSection
                  stationDesc={selectedStation.stationDesc}
                />
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
