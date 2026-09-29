import Script from "next/script";

export function CompanyChat() {
  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL?.replace(/\/+$/, "");
  if (!serverUrl) return null;

  return (
    <Script
      id="company-chat-widget"
      src={`${serverUrl}/widget.js`}
      data-api={serverUrl}
      data-chat-widget="true"
      strategy="lazyOnload"
    />
  );
}
