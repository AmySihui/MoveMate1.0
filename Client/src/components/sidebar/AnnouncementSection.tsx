import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

interface TrafficEvent {
  id: number;
  eventType: string;
  description: string;
  lineName: string;
  stopName: string;
  createdAt: string;
}

export default function AnnouncementSection() {
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/events/announcements")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-3">
      <div className="mb-2 text-lg font-semibold">
        Today's Community Updates
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No community events reported today.
        </div>
      ) : (
        <div className="max-h-60 space-y-3 overflow-y-auto">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Card>
  );
}

function EventCard({ event }: { event: TrafficEvent }) {
  const [images, setImages] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  const loadImages = () => {
    if (showImages) return;
    axios
      .get(`/api/event-images/event/${event.id}`)
      .then((res) => setImages(res.data.map((img: any) => img.imageUrl)))
      .catch(() => setImages([]))
      .finally(() => setShowImages(true));
  };

  return (
    <Card onClick={loadImages} className="cursor-pointer space-y-1 p-2">
      <div className="font-semibold">{event.eventType}</div>
      <div className="text-sm">{event.description}</div>
      <div className="text-xs text-muted-foreground">
        {event.lineName} - {event.stopName}
      </div>

      {showImages && images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              className="h-20 w-20 rounded object-cover"
            />
          ))}
        </div>
      )}
      {showImages && images.length === 0 && (
        <div className="text-xs text-muted-foreground">
          No images for this event.
        </div>
      )}
    </Card>
  );
}
