"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-ink">حدث خطأ غير متوقع أثناء تحميل الصفحة.</p>
      <button onClick={reset} className="rounded-full border border-black/15 px-5 py-2 text-sm text-ink">
        إعادة المحاولة
      </button>
    </div>
  );
}
