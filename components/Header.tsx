"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLocale } from "./LanguageProvider";
import type { NavItem } from "@/types";

export function Header({ logoUrl, navItems }: { logoUrl: string; navItems: NavItem[] }) {
  const { t, locale, toggle } = useLocale();
  const [open, setOpen] = useState(false);

  const links = navItems.map((item) => ({
    href: item.href,
    label: locale === "ar" ? item.label_ar : item.label_en || item.label_ar,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoUrl} alt="FAHAD ALMISHAN" width={36} height={36} className="rounded-md" />
          <span className="font-display text-sm tracking-wide text-ink">FAHAD ALMISHAN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
          >
            <Globe className="h-3.5 w-3.5" />
            {t.lang_toggle}
          </button>
          <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-base px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm text-ink-muted hover:bg-black/5 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
