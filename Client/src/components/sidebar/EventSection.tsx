import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSidebarStore } from "@/store/sidebarStore";
import axios from "axios";

interface Event {
  id: number;
  eventType: string;
  description: string;
  imageUrls?: string[];
  stopName: string;
}

export default function EventsSection() {
  const { selectedStation } = useSidebarStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/events/with-images");
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const safeEvents = Array.isArray(events) ? events : [];

  const filteredEvents = selectedStation
    ? safeEvents.filter(
        (e) =>
          e.stopName?.toLowerCase() ===
          selectedStation.stationDesc.toLowerCase(),
      )
    : safeEvents;

  const safeFilteredEvents = Array.isArray(filteredEvents)
    ? filteredEvents
    : [];

  const title = selectedStation
    ? `${selectedStation.stationDesc} Events`
    : "System Announcements";

  return (
    <div className="space-y-3 p-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading events...</div>
      ) : safeFilteredEvents.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No events available.
        </div>
      ) : (
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {safeFilteredEvents.map((ev) => (
            <Card key={ev.id} className="space-y-2 p-3">
              <div className="font-semibold text-primary">{ev.eventType}</div>
              <p className="text-sm text-muted-foreground">{ev.description}</p>
              {(ev.imageUrls?.length ?? 0) > 0 && (
                <img
                  src={ev.imageUrls![0]}
                  alt="Event"
                  className="h-32 w-full rounded object-cover"
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
