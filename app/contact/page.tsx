import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Contacts from "@/components/contact/Contacts";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Contacts />

      <Footer />
    </main>
  );
}
