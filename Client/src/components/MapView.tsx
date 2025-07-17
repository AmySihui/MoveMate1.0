import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Authenticator } from "@aws-amplify/ui-react";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate, useLocation } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

const EVENT_TYPES = [
  { label: "Delay", value: "Delay" },
  { label: "Suspension", value: "Suspension" },
  { label: "Closure", value: "Closure" },
  { label: "Other", value: "Other" },
];

const eventFormSchema = z.object({
  eventType: z.string().min(1, "Please select event type"),
  description: z.string().min(2, "Please enter description"),
});

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStation, setCurrentStation] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  const eventForm = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { eventType: "", description: "" },
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-6.2603, 53.3498],
      zoom: 11,
    });
    mapRef.current = map;

    let hoverPopup: mapboxgl.Popup | null = null;

    map.on("load", async () => {
      const [linesRes, stationsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/dart/lines"),
        axios.get("http://localhost:8080/api/dart/stations"),
      ]);

      map.addSource("dart-lines", { type: "geojson", data: linesRes.data });
      map.addLayer({
        id: "dart-line-layer",
        type: "line",
        source: "dart-lines",
        paint: { "line-color": "#1DB954", "line-width": 4 },
      });

      const stationsGeoJSON = stationsRes.data;

      map.addSource("dart-stations", {
        type: "geojson",
        data: stationsGeoJSON,
      });
      map.addLayer({
        id: "dart-stations-layer",
        type: "circle",
        source: "dart-stations",
        paint: {
          "circle-radius": 6,
          "circle-color": "#F97316",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "dart-stations-highlight",
        type: "circle",
        source: "dart-stations",
        paint: {
          "circle-radius": 10,
          "circle-color": "#FACC15",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#000",
        },
        filter: ["==", "stationDesc", ""],
      });

      map.on("mousemove", "dart-stations-layer", (e) => {
        const station = e.features?.[0];
        map.setFilter("dart-stations-highlight", [
          "==",
          "name",
          station?.properties?.name ?? "",
        ]);

        if (station) {
          if (!hoverPopup) {
            hoverPopup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            });
          }
          hoverPopup
            .setLngLat(e.lngLat)
            .setHTML(
              `<h3 style='margin:0;font-size:16px;'>${station.properties?.stationDesc}</h3>`,
            )
            .addTo(map);
        }
      });

      map.on("mouseleave", "dart-stations-layer", () => {
        map.setFilter("dart-stations-highlight", ["==", "stationDesc", ""]);
        if (hoverPopup) hoverPopup.remove();
        hoverPopup = null;
      });

      map.on("click", "dart-stations-layer", async (e) => {
        const station = e.features?.[0];
        if (!station) return;

        if (hoverPopup) {
          hoverPopup.remove();
          hoverPopup = null;
        }

        setDialogOpen(true);
        setCurrentStation(station);
        setLoadingEvents(true);

        try {
          const res = await axios.get(
            `http://localhost:8080/api/traffic-events?stopName=${encodeURIComponent(station.properties?.stationDesc)}`,
          );
          setEvents(res.data);
        } catch {
          setEvents([]);
        }
        setLoadingEvents(false);
      });
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("addEvent") === "1") {
      setShowAddForm(true);
    }
  }, [location.search]);

  async function onAddEvent(values: any) {
    if (!currentStation) return;
    const stopName = currentStation.properties?.stationDesc;
    const [lng, lat] = (currentStation.geometry as GeoJSON.Point).coordinates;

    await axios.post("http://localhost:8080/api/events", {
      ...values,
      stopName,
      lineName: "DART",
      latitude: lat,
      longitude: lng,
      status: "pending",
      userSub: "anonymous",
      imageUrl, // 新增
    });

    const res = await axios.get(
      `http://localhost:8080/api/traffic-events?stopName=${encodeURIComponent(stopName)}`,
    );
    setEvents(res.data);
    eventForm.reset();
    setImageUrl("");
    setShowAddForm(false);
  }

  const handleAddEventClick = async () => {
    try {
      await getCurrentUser();
      setShowAddForm(true); // 已登录，直接展示表单
    } catch {
      navigate("/login?redirect=/map&addEvent=1"); // 未登录，跳转到登录页
    }
  };

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <Dialog
        open={dialogOpen}
        onOpenChange={(open: boolean) => {
          setDialogOpen(open);
          setShowAddForm(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStation?.properties?.stationDesc}</DialogTitle>
            <DialogDescription>
              {currentStation
                ? `Lng: ${(currentStation.geometry as GeoJSON.Point).coordinates[0]}, Lat: ${(currentStation.geometry as GeoJSON.Point).coordinates[1]}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <Card className="border-none bg-transparent p-0 shadow-none">
            {!showAddForm ? (
              <>
                <div className="mb-4">
                  <h4 className="mb-2 text-lg font-semibold">Events</h4>
                  {loadingEvents ? (
                    <div>Loading...</div>
                  ) : events.length > 0 ? (
                    <div className="max-h-48 space-y-3 overflow-y-auto">
                      {events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-1 rounded-lg border bg-gray-50 p-3 shadow-sm"
                        >
                          <div className="font-bold text-primary">
                            {ev.eventType}
                          </div>
                          <div className="text-gray-700">{ev.description}</div>
                          {ev.imageUrl && (
                            <img
                              src={ev.imageUrl}
                              alt="Event"
                              className="mt-2 h-20 w-auto rounded border object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No events reported.</div>
                  )}
                </div>
                <Button className="mt-4 w-full" onClick={handleAddEventClick}>
                  Add Event
                </Button>
                {showAuth && (
                  <Authenticator>
                    {({ user }) => {
                      useEffect(() => {
                        if (user) {
                          setShowAuth(false);
                          setShowAddForm(true);
                        }
                      }, [user]);
                      return <div />;
                    }}
                  </Authenticator>
                )}
              </>
            ) : (
              <div>
                <h4 className="mb-2 text-lg font-semibold">Add Event</h4>
                <Form {...eventForm}>
                  <form
                    onSubmit={eventForm.handleSubmit(onAddEvent)}
                    className="space-y-3"
                  >
                    <FormField
                      control={eventForm.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border px-2 py-1"
                            >
                              <option value="">Select type</option>
                              {EVENT_TYPES.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Describe the event..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            setSelectedImage(file);
                            try {
                              const { data } = await axios.post(
                                "http://localhost:8080/api/s3/presigned-url",
                                {
                                  fileName: file.name,
                                  fileType: file.type,
                                },
                              );
                              await axios.put(data.url, file, {
                                headers: { "Content-Type": file.type },
                              });
                              setImageUrl(data.url.split("?")[0]);
                            } catch {
                              setImageUrl("");
                            }
                            setUploading(false);
                          }}
                        />
                      </FormControl>
                      {uploading && <div>Uploading image...</div>}
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Upload"
                          className="mt-2 h-24 rounded border object-cover"
                        />
                      )}
                    </FormItem>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={uploading}
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          setShowAddForm(false);
                          eventForm.reset();
                          setImageUrl("");
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
