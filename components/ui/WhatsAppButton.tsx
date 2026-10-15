
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "94706833644";
  const message =
    "Hello BillPOS! I'm interested in your POS solutions. Could you please provide more information?";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BillPOS on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:scale-110 hover:bg-[#20BA5A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
    >
      <FaWhatsapp size={34} />

      <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
    </a>
  );
}
