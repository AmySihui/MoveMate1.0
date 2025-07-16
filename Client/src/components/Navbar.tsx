// src/components/Navbar.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-white/10 text-white backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="group flex items-center gap-2 text-2xl font-extrabold text-black transition-colors hover:text-white"
        >
          <img
            src={logo}
            alt="MoveMate Logo"
            className="h-8 w-8 transition group-hover:brightness-0 group-hover:invert"
          />
          MoveMate
        </Link>

        <div className="flex items-center gap-4 hover:text-white">
          <Button
            asChild
            className="bg-black text-white transition-colors hover:bg-white hover:text-black"
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
