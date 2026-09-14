import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import type { SiteContact } from "@/types";

export function Footer({ contact }: { contact: SiteContact }) {
  return (
    <footer className="border-t border-black/5 bg-base-layer/50 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <div>
          <p className="font-display text-lg text-ink">FAHAD ALMISHAN</p>
          <p className="text-sm text-ink-muted">مهندس برمجيات · خبير في عالم الذكاء الاصطناعي</p>
        </div>

        <div className="flex items-center gap-5">
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-electric-soft" aria-label="WhatsApp">
            واتساب
          </a>
          <a href={`mailto:${contact.email}`} className="text-ink-muted hover:text-electric-soft" aria-label="Email">
            {contact.email}
          </a>
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-electric-soft" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href={`https://snapchat.com/add/${contact.snapchat}`} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-electric-soft" aria-label="Snapchat">
            سناب
          </a>
          <a href={`https://x.com/${contact.x}`} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-electric-soft" aria-label="X">
            <Twitter className="h-5 w-5" />
          </a>
        </div>

        <p className="text-sm text-ink-muted">أفكار اليوم.. تصنع نجاحك غداً</p>
        <p className="text-xs text-ink-muted/60">
          © {new Date().getFullYear()} Fahad Almishan · <Link href="/admin" className="hover:text-ink-muted">لوحة التحكم</Link>
        </p>
      </div>
    </footer>
  );
}
