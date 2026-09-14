import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, getServices } from "@/lib/data/fetch";
import { buildWhatsAppUrl, simpleServiceMessage } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: service.title_ar,
    description: service.description_ar,
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl text-ink">{service.title_ar}</h1>
      <p className="mt-3 text-ink-muted">{service.description_ar}</p>

      {service.show_price && (service.price_min || service.price_max) ? (
        <p className="mt-4 text-lg">
          <span className="font-medium text-electric-soft">
            {service.price_min && service.price_max && service.price_min !== service.price_max
              ? `${service.price_min} — ${service.price_max} ريال`
              : `يبدأ من ${service.price_min ?? service.price_max} ريال`}
          </span>
          {service.price_note && <span className="text-ink-muted"> · {service.price_note}</span>}
        </p>
      ) : (
        <p className="mt-4 text-ink-muted">السعر: تواصل معنا</p>
      )}

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {service.features_ar.map((f) => (
          <li key={f} className="glass rounded-xl px-4 py-3 text-sm text-ink-muted">
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={buildWhatsAppUrl(simpleServiceMessage(service.title_ar))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-center text-sm font-medium text-white shadow-glow"
        >
          اطلب هذه الخدمة
        </a>
        <Link
          href={`/portfolio?category=${service.category}`}
          className="rounded-full border border-black/15 bg-black/5 px-6 py-3 text-center text-sm font-medium text-ink"
        >
          شاهد أعمال مرتبطة
        </Link>
      </div>
    </div>
  );
}
