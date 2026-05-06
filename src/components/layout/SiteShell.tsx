"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className={`flex-1 ${isHome ? "" : "pt-32 md:pt-40"}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
