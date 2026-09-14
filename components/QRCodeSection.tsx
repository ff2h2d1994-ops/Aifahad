import QRCode from "qrcode";

export async function QRCodeSection() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const qrDataUrl = await QRCode.toDataURL(siteUrl, {
    margin: 1,
    color: { dark: "#E7ECFD", light: "#00000000" },
    width: 220,
  });

  return (
    <section className="px-5 py-16">
      <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt="QR Code" width={180} height={180} />
        <div>
          <p className="font-display text-lg text-ink">امسح الكود</p>
          <p className="text-sm text-ink-muted">لمشاهدة الأعمال وطلب خدمتك</p>
        </div>
      </div>
    </section>
  );
}
