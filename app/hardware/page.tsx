import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hardware from "@/components/hardware/Hardware";

export default function HardwarePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Hardware />

      <Footer />
    </main>
  );
}
