"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

const CATEGORIES: { value: string; label_ar: string }[] = [
  { value: "all", label_ar: "الكل" },
  { value: "ai", label_ar: "AI" },
  { value: "photo", label_ar: "الصور" },
  { value: "design", label_ar: "الجرافيك" },
  { value: "video", label_ar: "الفيديو" },
  { value: "web", label_ar: "المواقع" },
  { value: "audio", label_ar: "الصوت" },
  { value: "content", label_ar: "المحتوى" },
  { value: "data", label_ar: "البيانات" },
  { value: "other", label_ar: "أخرى" },
];

export function PortfolioGrid({ projects, initialCategory }: { projects: Project[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory || "all");

  const filtered = useMemo(() => {
    const list = category === "all" ? projects : projects.filter((p) => p.category === category);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order_index - b.order_index);
  }, [projects, category]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === c.value
                ? "border-electric-soft bg-electric/15 text-electric-soft"
                : "border-black/10 text-ink-muted hover:text-ink"
            }`}
          >
            {c.label_ar}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">لا توجد أعمال في هذا التصنيف حاليًا.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((p) => {
            const cover = p.media?.[0];
            return (
              <Link
                key={p.id}
                href={`/portfolio/${p.slug}`}
                className="glass group block break-inside-avoid overflow-hidden rounded-2xl"
              >
                {cover?.type === "image" ? (
                  <div className="relative aspect-[4/3] w-full bg-base-layer2">
                    <Image src={cover.url} alt={p.title_ar} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-base-layer2 text-ink-muted">
                    {p.title_ar[0]}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm text-ink">{p.title_ar}</h3>
                    {p.featured && <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] text-ember">مميز</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{p.description_ar}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
