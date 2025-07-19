import HomePage from "@/pages/HomePage";
import MapPage from "@/pages/MapPage";
import LoginPage from "@/pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
