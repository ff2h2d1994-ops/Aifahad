"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

const ToastContext = createContext<{ show: (message: string, kind?: ToastKind) => void }>({
  show: () => {},
});

export function useToast() {
  return useContext(ToastContext).show;
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, kind: ToastKind = "info") => {
    const id = nextId++;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl px-4 py-3 text-sm shadow-lg ${
              toast.kind === "success" ? "border-emerald-500/30" : toast.kind === "error" ? "border-red-500/30" : "border-black/10"
            }`}
          >
            {toast.kind === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
            {toast.kind === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}
            {toast.kind === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" />}
            <p className="flex-1 text-ink">{toast.message}</p>
            <button
              onClick={() => setToasts((t) => t.filter((x) => x.id !== toast.id))}
              className="text-ink-muted hover:text-ink"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
