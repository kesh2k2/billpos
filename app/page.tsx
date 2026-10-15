
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import IndustrySection from "@/components/home/IndustrySection";
import TestimonialSection from "@/components/home/TestimonialSection";
import Footer from "@/components/ui/Footer";
export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <IndustrySection />
      <TestimonialSection />
      <Footer />
    </main>
  );
}