"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/layout/MobileCtaBar";

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
      <div className={`flex-1 ${isHome ? "" : "pt-24 md:pt-32"}`}>
        {children}
      </div>
      <Footer />
      {/* Platz, damit die fixierte Mobile-Leiste nichts überdeckt. */}
      <div className="h-[76px] md:hidden" />
      <MobileCtaBar />
    </div>
  );
}
