import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";

export default function MapPage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="h-0 flex-1 pt-16">
        <MapView />
      </div>
    </div>
  );
}
