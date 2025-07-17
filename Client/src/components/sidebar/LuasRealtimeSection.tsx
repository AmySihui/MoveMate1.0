import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

interface Tram {
  dueMins: string;
  dest: string;
  direction: string;
}

export default function LuasRealtimeSection({
  stationDesc,
}: {
  stationDesc: string;
}) {
  const [stopId, setStopId] = useState<string | null>(null);
  const [trams, setTrams] = useState<Tram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationDesc) {
      console.warn("stationDesc is empty, skipping stopId request.");
      return;
    }
    setStopId(null);
    setTrams([]);
    setError(null);

    console.log("Fetching stopId for:", stationDesc);

    axios
      .get("/api/luas/stop-id", { params: { name: stationDesc } })
      .then((res) => {
        console.log("stopId:", res.data);
        setStopId(res.data);
      })
      .catch((e) => {
        console.error("Failed to fetch stopId:", e);
        setError("Failed to find stop ID for this station.");
      });
  }, [stationDesc]);

  useEffect(() => {
    if (!stopId) return;

    console.log("Fetching realtime data for stopId:", stopId);

    setLoading(true);
    setError(null);

    axios
      .get("/api/luas/forecast", { params: { stop: stopId } })
      .then((res) => {
        console.log("Request URL:", res.request?.responseURL);
        console.log("Raw response:", res.data);

        if (typeof res.data === "string" && res.data.includes("<h1>500</h1>")) {
          setError("No official realtime data available for this station.");
          setTrams([]);
          return;
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(res.data, "application/xml");
        const directions = xml.querySelectorAll("direction");
        const tramList: Tram[] = [];
        directions.forEach((dir) => {
          const dirName = dir.getAttribute("name") || "";
          dir.querySelectorAll("tram").forEach((tram) => {
            tramList.push({
              dueMins: tram.getAttribute("dueMins") || "-",
              dest: tram.getAttribute("destination") || "Unknown",
              direction: dirName,
            });
          });
        });
        console.log("Parsed trams:", tramList);
        setTrams(tramList);
      })
      .catch((e) => {
        console.error("Failed to fetch realtime data:", e);
        setError("Failed to fetch realtime trams.");
        setTrams([]);
      })
      .finally(() => setLoading(false));
  }, [stopId]);

  return (
    <Card className="mt-2 p-3">
      <div className="mb-2 font-semibold">LUAS Realtime Info</div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : trams.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No realtime trams available.
        </div>
      ) : (
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {trams.map((tram, idx) => (
            <div
              key={idx}
              className="mb-1 border-b pb-1 last:mb-0 last:border-b-0 last:pb-0"
            >
              <div>Destination: {tram.dest}</div>
              <div>Due in: {tram.dueMins} min</div>
              <div>Direction: {tram.direction}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
