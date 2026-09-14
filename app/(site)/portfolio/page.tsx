import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getProjects } from "@/lib/data/fetch";

export const metadata: Metadata = {
  title: "أعمالي",
  description: "معرض أعمال فهد المشعان: ذكاء اصطناعي، تصميم، فيديو، مواقع، وأكثر.",
};

export default async function PortfolioPage({ searchParams }: { searchParams: { category?: string } }) {
  const projects = await getProjects();
  return (
    <div className="px-5 py-16">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="font-display text-3xl text-ink md:text-4xl">أعمالي</h1>
        <p className="mt-3 text-ink-muted">نماذج من المشاريع المنجزة عبر مختلف الخدمات.</p>
      </div>
      <div className="mx-auto max-w-6xl">
        <PortfolioGrid projects={projects} initialCategory={searchParams.category} />
      </div>
    </div>
  );
}
