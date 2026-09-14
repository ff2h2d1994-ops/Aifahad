"use client";

import Link from "next/link";
import { useLocale } from "./LanguageProvider";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "@/types";

export function ServicesGrid({ services, isAdmin = false }: { services: Service[]; isAdmin?: boolean }) {
  const { t } = useLocale();
  const sorted = [...services].sort((a, b) => a.order_index - b.order_index);

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s) => (
            <ServiceCard key={s.id} service={s} isAdmin={isAdmin} />
          ))}
        </div>

        <div className="glass mt-8 flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl text-ink">{t.custom_title}</h3>
          <p className="text-sm text-ink-muted">{t.custom_subtitle}</p>
          <Link
            href="/request"
            className="mt-2 rounded-full bg-gradient-to-r from-electric to-violet px-6 py-2.5 text-sm font-medium text-white shadow-glow"
          >
            {t.cta_custom}
          </Link>
        </div>
      </div>
    </section>
  );
}
