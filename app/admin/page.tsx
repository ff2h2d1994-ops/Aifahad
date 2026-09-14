import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: projectsCount },
    { count: servicesCount },
    { count: newRequests },
    { count: viewsToday },
    { count: viewsWeek },
    { count: viewsTotal },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "جديد"),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
  ]);

  const cards = [
    { label: "الأعمال المنشورة", value: projectsCount ?? 0, href: "/admin/projects" },
    { label: "الخدمات", value: servicesCount ?? 0, href: "/admin/services" },
    { label: "طلبات جديدة", value: newRequests ?? 0, href: "/admin/requests" },
    { label: "تقييمات بانتظار الموافقة", value: pendingReviews ?? 0, href: "/admin/reviews" },
  ];

  const viewCards = [
    { label: "زيارات اليوم", value: viewsToday ?? 0 },
    { label: "زيارات آخر 7 أيام", value: viewsWeek ?? 0 },
    { label: "إجمالي الزيارات", value: viewsTotal ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">نظرة عامة</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="glass rounded-2xl p-6 transition-colors hover:border-electric-soft/40">
            <p className="text-3xl font-semibold text-ink">{c.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg text-ink">زوار الموقع</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {viewCards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-6">
            <p className="text-3xl font-semibold text-ink">{c.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
