import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import SolutionsHero from "@/components/solutions/SolutionsHero";
import SolutionSelector from "@/components/solutions/SolutionSelector";
import FloatingGallery from "@/components/solutions/FloatingGallery";
// import FloatingGallery from "@/components/solutions/FloatingGallery";
// import SolutionOverview from "@/components/solutions/SolutionOverview";
// import RetailSolution from "@/components/solutions/RetailSolution";
// import RestaurantSolution from "@/components/solutions/RestaurantSolution";
// import FashionSolution from "@/components/solutions/FashionSolution";
// import SalonSolution from "@/components/solutions/SalonSolution";
// import SMESolution from "@/components/solutions/SMESolution";
// import CommonFeatures from "@/components/solutions/CommonFeatures";
// import SolutionsCTA from "@/components/solutions/SolutionsCTA";

export default function SolutionsPage() {
  return (
    <main>
      <Navbar />

      <SolutionsHero />

      <SolutionSelector />

      <FloatingGallery />



      {/* <SolutionSelector />

      <SolutionOverview />

      <RetailSolution />

      <RestaurantSolution />

      <FashionSolution />

      <SalonSolution />

      <SMESolution />

      <CommonFeatures />

      <SolutionsCTA /> */}

      <Footer />
    </main>
  );
}