"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useLocale } from "./LanguageProvider";
import { buildWhatsAppUrl, simpleServiceMessage } from "@/lib/whatsapp";
import { AdminServiceUploadButton } from "@/components/admin/AdminServiceUploadButton";
import type { Service } from "@/types";

function DynamicIcon({ name }: { name: string }) {
  const pascalName = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[pascalName] || Icons.Sparkles;
  return <Cmp className="h-6 w-6 text-electric-soft" />;
}

function PriceTag({ service }: { service: Service }) {
  if (!service.show_price || (!service.price_min && !service.price_max)) {
    return <p className="mt-3 text-sm text-ink-muted">السعر: تواصل معنا</p>;
  }
  const range =
    service.price_min && service.price_max && service.price_min !== service.price_max
      ? `${service.price_min} — ${service.price_max} ريال`
      : `يبدأ من ${service.price_min ?? service.price_max} ريال`;
  return (
    <p className="mt-3 text-sm text-ink">
      <span className="font-medium text-electric-soft">{range}</span>
      {service.price_note && <span className="text-ink-muted"> · {service.price_note}</span>}
    </p>
  );
}

export function ServiceCard({ service, isAdmin = false }: { service: Service; isAdmin?: boolean }) {
  const { t, locale } = useLocale();
  const title = locale === "ar" ? service.title_ar : service.title_en;
  const desc = locale === "ar" ? service.description_ar : service.description_en;

  return (
    <div className="glass group flex flex-col rounded-2xl p-6 transition-shadow hover:shadow-glow">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
        <DynamicIcon name={service.icon} />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
      <PriceTag service={service} />

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <Link href={`/services/${service.slug}`} className="rounded-full border border-black/10 px-3 py-1.5 text-ink-muted transition-colors hover:text-ink">
          {t.cta_details}
        </Link>
        <a
          href={buildWhatsAppUrl(simpleServiceMessage(title))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-electric/15 px-3 py-1.5 text-electric-soft transition-colors hover:bg-electric/25"
        >
          {t.cta_order}
        </a>
        <Link href={`/portfolio?category=${service.category}`} className="rounded-full border border-black/10 px-3 py-1.5 text-ink-muted transition-colors hover:text-ink">
          {t.cta_related_work}
        </Link>
        {isAdmin && <AdminServiceUploadButton serviceCategory={service.category} serviceTitle={service.title_ar} />}
      </div>
    </div>
  );
}
