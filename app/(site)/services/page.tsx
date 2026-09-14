import type { Metadata } from "next";
import { ServicesGrid } from "@/components/ServicesGrid";
import { getServices } from "@/lib/data/fetch";
import { getAuthorizedUser } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الخدمات",
  description: "خدمات الذكاء الاصطناعي، معالجة الصور، التصميم الجرافيكي، الفيديو، الصوت، المواقع والبرمجة، وأكثر.",
};

export default async function ServicesPage() {
  const [services, admin] = await Promise.all([getServices(), getAuthorizedUser()]);
  return (
    <div className="pt-10">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h1 className="font-display text-3xl text-ink md:text-4xl">الخدمات</h1>
        <p className="mt-3 text-ink-muted">حلول متكاملة بقوة الذكاء الاصطناعي لكل احتياجاتك الرقمية.</p>
      </div>
      <ServicesGrid services={services} isAdmin={!!admin} />
    </div>
  );
}
