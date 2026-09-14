import type { Metadata } from "next";
import { RequestForm } from "@/components/RequestForm";
import { getServices } from "@/lib/data/fetch";

export const metadata: Metadata = {
  title: "اطلب خدمتك",
  description: "أرسل تفاصيل مشروعك وسنتواصل معك في أقرب وقت.",
};

export default async function RequestPage() {
  const services = await getServices();
  return (
    <div className="px-5 py-16">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="font-display text-3xl text-ink">اطلب خدمتك الآن</h1>
        <p className="mt-3 text-ink-muted">عبّئ النموذج وسنرد عليك في أقرب وقت ممكن.</p>
      </div>
      <RequestForm services={services} />
    </div>
  );
}
