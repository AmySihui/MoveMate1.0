import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSidebarStore } from "@/store/sidebarStore";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  eventType: string;
  description: string;
  imageUrls?: string[];
  stopName: string;
  userSub: string;
}

interface EventSectionProps {
  station?: any;
  onRefetch?: (fn: () => void) => void;
}

export default function EventSection({
  station,
  onRefetch,
}: EventSectionProps) {
  const { selectedStation } = useSidebarStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserSub, setCurrentUserSub] = useState<string>("");

  // 允许外部触发刷新
  useEffect(() => {
    if (onRefetch) {
      onRefetch(() => fetchEvents());
    }
    // eslint-disable-next-line
  }, [onRefetch]);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserSub(user.userId || "");
      } catch {
        setCurrentUserSub("");
      }
    };
    fetchUser();
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!currentUserSub) return;
    await axios.delete(`/api/events/${id}?userSub=${currentUserSub}`);
    await fetchEvents();
  };

  const { toast } = useToast();

  const handleReport = async (id: number) => {
    try {
      await axios.post(`/api/events/report/${id}`);
      toast({
        description:
          "Report submitted successfully, thank you for your feedback!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to report, please try again later.",
      });
    }
  };

  const safeEvents = Array.isArray(events) ? events : [];

  // System Announcements 只显示官方消息（无 userSub 或 userSub === 'SYSTEM'）
  const isSystemAnnouncement = !(station || selectedStation);
  const systemEvents = safeEvents.filter(
    (e) => !e.userSub || e.userSub === "SYSTEM",
  );
  const filteredEvents = isSystemAnnouncement
    ? systemEvents
    : safeEvents.filter(
        (e) =>
          e.stopName?.toLowerCase() ===
          (
            station?.stationDesc ||
            selectedStation?.stationDesc ||
            ""
          ).toLowerCase(),
      );

  const safeFilteredEvents = Array.isArray(filteredEvents)
    ? filteredEvents
    : [];

  const title =
    station || selectedStation
      ? `${station?.stationDesc || selectedStation?.stationDesc} Events`
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
              <div className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Community Event
              </div>

              <div className="font-semibold text-primary">{ev.eventType}</div>
              <p className="text-sm text-muted-foreground">{ev.description}</p>
              {(ev.imageUrls?.length ?? 0) > 0 && (
                <img
                  src={ev.imageUrls![0]}
                  alt="Event"
                  className="h-32 w-full rounded object-cover"
                />
              )}
              {/* 删除按钮，仅对自己上报的事件显示 */}
              {ev.userSub === currentUserSub && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(ev.id)}
                  className="mt-2"
                >
                  Delete
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReport(ev.id)}
              >
                Report
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
