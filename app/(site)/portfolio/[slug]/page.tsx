import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug, getProjects } from "@/lib/data/fetch";
import { buildWhatsAppUrl, simpleServiceMessage } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.title_ar, description: project.description_ar };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-3xl text-ink">{project.title_ar}</h1>
      <p className="mt-3 text-ink-muted">{project.description_ar}</p>

      {project.media?.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.media.map((m, i) =>
            m.type === "image" ? (
              <div key={i} className="relative aspect-video overflow-hidden rounded-2xl bg-base-layer2">
                <Image src={m.url} alt={`${project.title_ar} ${i + 1}`} fill className="object-cover" />
              </div>
            ) : (
              <video key={i} src={m.url} controls className="aspect-video w-full rounded-2xl bg-black" />
            )
          )}
        </div>
      )}

      {project.before_after?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">قبل / بعد</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.before_after.map((ba, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-base-layer2">
                  <Image src={ba.before_url} alt="قبل" fill className="object-cover" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-base-layer2">
                  <Image src={ba.after_url} alt="بعد" fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.links?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/15 px-4 py-2 text-sm text-ink-muted hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
      )}

      <a
        href={buildWhatsAppUrl(simpleServiceMessage(project.category))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-sm font-medium text-white shadow-glow"
      >
        اطلب خدمة مشابهة
      </a>
    </div>
  );
}
