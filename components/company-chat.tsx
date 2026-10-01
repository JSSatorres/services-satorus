"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function CompanyChat() {
  const [loaded, setLoaded] = useState(false);
  const serverUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL?.replace(/\/+$/, "");

  useEffect(() => {
    if (!loaded) return;

    const widget = document.querySelector<HTMLElement>("empresa-chat");
    const panel = widget?.shadowRoot?.querySelector(".panel");
    if (!widget || !panel) return;

    const syncPosition = () => {
      widget.dataset.satorusChat = panel.hasAttribute("hidden") ? "closed" : "open";
    };
    const observer = new MutationObserver(syncPosition);
    observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    syncPosition();

    return () => {
      observer.disconnect();
      delete widget.dataset.satorusChat;
    };
  }, [loaded]);

  if (!serverUrl) return null;

  return (
    <Script
      id="company-chat-widget"
      src={`${serverUrl}/widget.js`}
      data-api={serverUrl}
      data-chat-widget="true"
      strategy="lazyOnload"
      onReady={() => setLoaded(true)}
    />
  );
}
