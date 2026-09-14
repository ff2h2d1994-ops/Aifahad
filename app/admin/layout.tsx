import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, ListTree, Inbox, Settings, LogOut, Star } from "lucide-react";
import { getAuthorizedUser } from "@/lib/utils";
import { signOutAdmin } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/projects", label: "الأعمال", icon: ImageIcon },
  { href: "/admin/services", label: "الخدمات", icon: ListTree },
  { href: "/admin/requests", label: "الطلبات", icon: Inbox },
  { href: "/admin/reviews", label: "التقييمات", icon: Star },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAuthorizedUser();

  // Not authenticated yet (e.g. /admin/login) — render bare, no dashboard chrome.
  // Every other /admin/* path is already guarded by middleware.ts.
  if (!admin) return <div className="bg-base">{children}</div>;

  return (
    <div className="flex min-h-screen bg-base">
      <aside className="hidden w-64 shrink-0 border-l border-black/5 bg-base-layer/40 p-5 md:block">
        <p className="mb-8 font-display text-sm text-ink">لوحة تحكم فهد المشعان</p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-black/5 hover:text-ink">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="mt-8">
          <button type="submit" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 md:hidden">
          <p className="font-display text-sm text-ink">لوحة التحكم</p>
          <form action={signOutAdmin}>
            <button type="submit" className="text-xs text-red-600">خروج</button>
          </form>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
