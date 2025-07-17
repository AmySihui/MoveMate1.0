import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

interface DartRealtime {
  trainCode: string;
  origin: string;
  destination: string;
  expArrival: string;
  expDeparture: string;
  status: string;
  direction: string;
  dueIn: number;
  late: number;
  lastLocation: string;
}

export default function DartRealtimeSection({
  stationDesc,
}: {
  stationDesc: string;
}) {
  const [data, setData] = useState<DartRealtime[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationDesc) return;
    setLoading(true);
    axios
      .get(`/api/dart/station/${encodeURIComponent(stationDesc)}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [stationDesc]);

  if (!stationDesc) return null;

  return (
    <Card className="mt-2 p-3">
      <div className="mb-2 font-semibold">DART Realtime Info</div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !data || data.length === 0 ? (
        <div className="text-sm text-muted-foreground">No realtime data</div>
      ) : (
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="mb-1 border-b pb-1 last:mb-0 last:border-b-0 last:pb-0"
            >
              <div>
                Train: {item.trainCode} {item.direction}
              </div>
              <div>
                Arrival: {item.expArrival}, Departure: {item.expDeparture}
              </div>
              <div>
                Status: {item.status}, Late: {item.late} min
              </div>
              <div>Destination: {item.destination}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
