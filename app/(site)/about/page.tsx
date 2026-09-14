import type { Metadata } from "next";
import Image from "next/image";
import { getLogoUrl } from "@/lib/data/fetch";

export const metadata: Metadata = {
  title: "من أنا",
  description: "فهد المشعان — مهندس برمجيات وخبير في عالم الذكاء الاصطناعي.",
};

export default async function AboutPage() {
  const logoUrl = await getLogoUrl();
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <div className="relative mx-auto mb-8 h-20 w-20">
        <Image src={logoUrl} alt="Fahad Almishan" fill className="object-contain" />
      </div>
      <h1 className="font-display text-2xl text-ink">فهد المشعان</h1>
      <p className="text-sm text-ink-muted">FAHAD ALMISHAN</p>
      <p className="mt-2 text-ink-muted">مهندس برمجيات وخبير في عالم الذكاء الاصطناعي</p>
      <p className="mt-8 leading-relaxed text-ink-muted">
        أعمل على تحويل الأفكار إلى حلول رقمية وإبداعية باستخدام أحدث تقنيات الذكاء الاصطناعي، من صناعة
        المحتوى والتصميم ومعالجة الصور والفيديو إلى تطوير المواقع والبرمجيات وتحليل البيانات والحلول الذكية.
      </p>
    </div>
  );
}
