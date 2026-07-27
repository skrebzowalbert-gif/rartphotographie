"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/layout/MobileCtaBar";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Fixierte Navigation: konstanter Abstand auf allen Seiten. */}
      <div className="flex-1 pt-20 md:pt-24">
        {children}
      </div>
      <Footer />
      {/* Platz, damit die fixierte Mobile-Leiste nichts überdeckt. */}
      <div className="h-[76px] md:hidden" />
      <MobileCtaBar />
    </div>
  );
}
