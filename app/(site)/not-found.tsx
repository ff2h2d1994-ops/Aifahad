import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-ink">الصفحة غير موجودة.</p>
      <Link href="/" className="rounded-full border border-black/15 px-5 py-2 text-sm text-ink">العودة للرئيسية</Link>
    </div>
  );
}
