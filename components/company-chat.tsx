import Script from "next/script";
import { companyPhone, companyWhatsappHref } from "@/lib/site";

export function CompanyChat() {
  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL?.replace(/\/+$/, "");
  const configuredNumber = process.env.NEXT_PUBLIC_SATORUS_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = configuredNumber === companyPhone.href.replace(/\D/g, "")
    ? companyWhatsappHref
    : null;

  return (
    <>
      {whatsappUrl && (
        <a
          className="floating-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir a Satorus por WhatsApp"
          title="Escribir por WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
            <path d="M16 3.5a12.5 12.5 0 0 0-10.7 19L3.5 28.5l6.1-1.7A12.5 12.5 0 1 0 16 3.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M11.3 9.9c-.5-.5-1-.3-1.4.2-.6.8-1 1.7-.9 2.7.2 2.3 3.2 5.9 6.8 7.6 2 .9 3.5.8 4.6.2.7-.4 1.4-1.3 1.5-2.1 0-.3-.1-.5-.4-.6l-3-1.4c-.3-.1-.5-.1-.7.2l-1.3 1.5c-1.7-.7-3.2-2.1-4.2-3.7l1.2-1.4c.2-.2.3-.5.1-.8l-1.4-2.4c-.2-.4-.5-.5-.9 0Z" fill="currentColor" />
          </svg>
          <span className="floating-whatsapp-label">WhatsApp</span>
        </a>
      )}
      {serverUrl && (
        <Script
          id="company-chat-widget"
          src={`${serverUrl}/widget.js`}
          data-api={serverUrl}
          data-chat-widget="true"
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
