import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/store/mapStore";
import { useSidebarStore } from "@/store/sidebarStore";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const setMapRef = useMapStore((state) => state.setMapRef);
  const setSidebarSelectedStation = useSidebarStore(
    (state) => state.setSelectedStation,
  );
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-6.2603, 53.3498],
      zoom: 11,
    });
    mapRef.current = map;
    setMapRef(map);

    map.on("load", async () => {
      const dartLinesRes = await axios.get("/api/dart/lines");
      map.addSource("dart-lines", { type: "geojson", data: dartLinesRes.data });
      map.addLayer({
        id: "dart-line-layer",
        type: "line",
        source: "dart-lines",
        paint: { "line-color": "#1DB954", "line-width": 4 },
      });

      const dartStationsRes = await axios.get("/api/dart/stations");
      const dartStationsArray = dartStationsRes.data;
      const dartStationsGeoJSON = {
        type: "FeatureCollection" as const,
        features: dartStationsArray.map((station: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [station.longitude, station.latitude],
          },
          properties: {
            stationDesc: station.stationDesc,
            stationCode: station.stationCode,
          },
        })),
      };
      map.addSource("dart-stations", {
        type: "geojson",
        data: dartStationsGeoJSON,
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

      const luasLinesRes = await axios.get("/api/luas/lines");
      map.addSource("luas-lines", { type: "geojson", data: luasLinesRes.data });
      map.addLayer({
        id: "luas-lines-layer",
        type: "line",
        source: "luas-lines",
        paint: {
          "line-color": [
            "match",
            ["get", "ref"],
            "Luas Red Line",
            "#CC3333",
            "Luas Green Line",
            "#1DB954",
            "#AAAAAA",
          ],
          "line-width": 4,
        },
      });

      const luasStationsRes = await axios.get("/api/luas/stations");
      const luasStationsArray =
        luasStationsRes.data.features || luasStationsRes.data;

      const uniqueStationsMap = new Map();
      luasStationsArray.forEach((station: any) => {
        const name = station.properties.name;
        if (!uniqueStationsMap.has(name)) {
          uniqueStationsMap.set(name, station);
        }
      });
      const uniqueStations = Array.from(uniqueStationsMap.values());
      const luasStationsGeoJSON = {
        type: "FeatureCollection" as const,
        features: uniqueStations,
      };
      map.addSource("luas-stations", {
        type: "geojson",
        data: luasStationsGeoJSON,
      });
      map.addLayer({
        id: "luas-stations-layer",
        type: "circle",
        source: "luas-stations",
        paint: {
          "circle-radius": 6,
          "circle-color": "#FF9900",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      map.on("mouseenter", "luas-stations-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const { name } = e.features?.[0].properties || {};
        popup.setLngLat(e.lngLat).setHTML(`<b>${name}</b>`).addTo(map);
      });
      map.on("mouseleave", "luas-stations-layer", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      const dartPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      map.on("mouseenter", "dart-stations-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const { stationDesc } = e.features?.[0].properties || {};
        dartPopup
          .setLngLat(e.lngLat)
          .setHTML(`<b>${stationDesc}</b>`)
          .addTo(map);
      });
      map.on("mouseleave", "dart-stations-layer", () => {
        map.getCanvas().style.cursor = "";
        dartPopup.remove();
      });
      // 点击 dart 站点，联动侧边栏
      map.on("click", "dart-stations-layer", (e) => {
        const props = e.features?.[0].properties;
        if (props) {
          setSidebarSelectedStation({
            stationDesc: props.stationDesc,
            stationCode: props.stationCode,
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
            lineName: "DART",
          });
          setSidebarOpen(true);
        }
      });

      map.on("click", "luas-stations-layer", (e) => {
        const props = e.features?.[0].properties;
        if (props) {
          setSidebarSelectedStation({
            stationDesc: props.name,
            stationCode: props.stop_id || props.name,
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
            lineName: "LUAS",
          });
          setSidebarOpen(true);
        }
      });
    });

    return () => map.remove();
  }, [setMapRef, setSidebarSelectedStation, setSidebarOpen]);

  return <div ref={mapContainer} className="h-full w-full" />;
}
