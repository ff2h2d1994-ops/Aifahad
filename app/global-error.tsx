"use client";

// This catches errors that happen in the root layout itself — the one
// place a per-route error.tsx can't reach. It must render its own
// <html>/<body> since it replaces the entire root layout when it fires.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ background: "#05070E", color: "#E7ECFD", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", fontFamily: "sans-serif" }}>
        <p>حدث خطأ غير متوقع في الموقع.</p>
        <button
          onClick={reset}
          style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", padding: "0.5rem 1.25rem", color: "#E7ECFD", background: "transparent" }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
