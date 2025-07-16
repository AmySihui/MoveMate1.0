import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="flex h-full w-full flex-col">{children}</main>
    </div>
  );
}
