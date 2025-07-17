import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/store/mapStore";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const setMapRef = useMapStore((state) => state.setMapRef);

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
      // DART 线路
      const dartLinesRes = await axios.get("/api/dart/lines");
      map.addSource("dart-lines", { type: "geojson", data: dartLinesRes.data });
      map.addLayer({
        id: "dart-line-layer",
        type: "line",
        source: "dart-lines",
        paint: { "line-color": "#1DB954", "line-width": 4 },
      });

      // DART 站点
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

      // LUAS 线路
      const luasLinesRes = await axios.get("/api/luas/lines");
      map.addSource("luas-lines", { type: "geojson", data: luasLinesRes.data });
      map.addLayer({
        id: "luas-lines-layer",
        type: "line",
        source: "luas-lines",
        paint: {
          // 按 ref 区分红线绿线
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

      // LUAS 站点
      const luasStationsRes = await axios.get("/api/luas/stations");
      const luasStationsArray =
        luasStationsRes.data.features || luasStationsRes.data;
      // 去重
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

      // 鼠标悬停显示 luas 站名
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
      // 鼠标悬停显示 dart 站名
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
    });

    return () => map.remove();
  }, [setMapRef]);

  return <div ref={mapContainer} className="h-full w-full" />;
}
