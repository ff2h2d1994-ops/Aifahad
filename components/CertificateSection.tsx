import Image from "next/image";

export function CertificateSection({ verifyUrl }: { verifyUrl?: string }) {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <Image src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" width={28} height={28} unoptimized />
          <div className="text-start">
            <p className="text-sm font-medium text-ink">Google AI Professional Certificate</p>
            <p className="text-xs text-ink-muted">معتمد في مهارات الذكاء الاصطناعي وصناعة المحتوى وتحليل البيانات</p>
          </div>
        </div>
        {verifyUrl && (
          <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-electric-soft underline underline-offset-4">
            رابط التحقق من الشهادة
          </a>
        )}
      </div>
    </section>
  );
}
