// lib/send-email.ts
import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export async function sendViaEmailJS(
  templateId: string,
  params: Record<string, unknown>
) {
  const response = await emailjs.send(SERVICE_ID, templateId, params, {
    publicKey: PUBLIC_KEY,
  });

  if (response.status !== 200) {
    throw new Error(`EmailJS responded with status ${response.status}`);
  }

  return response;
}
