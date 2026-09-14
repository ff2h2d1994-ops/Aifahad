"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail on non-HTTPS/older browsers — no harm done.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-start transition-colors hover:border-electric-soft/40"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-ink-muted" />
        <div>
          <p className="text-xs text-ink-muted">{label}</p>
          <p className="text-sm text-ink" dir="ltr">{value}</p>
        </div>
      </div>
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-ink-muted" />}
    </button>
  );
}
