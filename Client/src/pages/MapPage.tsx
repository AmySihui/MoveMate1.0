import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/store/sidebarStore";

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const sidebarOpen = useSidebarStore((s) => s.sidebarOpen);
  const setSidebarOpen = useSidebarStore((s) => s.setSidebarOpen);

  useEffect(() => {
    axios.get("/api/dart/stations").then((res) => setStations(res.data || []));
  }, []);

  return (
    <Layout>
      <div className="relative flex h-[calc(100vh-64px)] w-full">
        <div className="flex-1">
          <MapView />
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button className="fixed right-6 top-20 z-50 rounded bg-black px-4 py-2 text-white shadow hover:bg-zinc-800">
              Menu
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="h-full w-[360px] border-none bg-white p-0 outline-none"
            hideCloseButton
          >
            <Sidebar stations={stations} />
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
