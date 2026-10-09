import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import About from "@/components/about/About";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

     <About />

      <Footer />
    </main>
  );
}