"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, simpleServiceMessage } from "@/lib/whatsapp";

export function WhatsAppButton({ serviceName, className }: { serviceName?: string; className?: string }) {
  const href = buildWhatsAppUrl(serviceName ? simpleServiceMessage(serviceName) : "السلام عليكم فهد، أرغب في الاستفسار عن خدماتك");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}

// Fixed, non-intrusive sticky button — mobile-first per the brief.
export function StickyWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl("السلام عليكم فهد، أرغب في الاستفسار عن خدماتك")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-glow transition-transform hover:scale-105 md:hidden"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}
