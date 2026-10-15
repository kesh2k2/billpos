
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import SolutionsHero from "@/components/solutions/SolutionsHero";
import SolutionSelector from "@/components/solutions/SolutionSelector";
import RetailSolution from "@/components/solutions/RetailSolution";
import RestaurantSolution from "@/components/solutions/RestaurantSolution";
import FloatingGallery from "@/components/solutions/FloatingGallery";
import MultiSolutionOverview from "@/components/solutions/MultiSolutionOverview";

export default function SolutionsPage() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/solutions") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return (
    <main>
      <Navbar />

      <SolutionsHero />

      <SolutionSelector />

      <RetailSolution />

      <RestaurantSolution />

      <MultiSolutionOverview />

      <FloatingGallery />

      <Footer />
    </main>
  );
}
