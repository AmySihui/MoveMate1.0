import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    axios.get("/api/dart/stations").then((res) => setStations(res.data || []));
  }, []);

  return (
    <Layout>
      <div className="relative h-[calc(100vh-64px)] w-full">
        <MapView />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSidebar((prev) => !prev);
          }}
          className="absolute right-4 top-4 z-50 rounded-md bg-black/80 px-4 py-2 text-white shadow hover:bg-black"
        >
          {showSidebar ? "Close" : "Menu"}
        </button>

        <Sidebar stations={stations} show={showSidebar} />
      </div>
    </Layout>
  );
}
