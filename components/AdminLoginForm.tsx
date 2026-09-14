"use client";

import { useState, useTransition } from "react";
import { signInAdmin } from "@/lib/actions/auth";

export function AdminLoginForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await signInAdmin(formData);
      // signInAdmin redirects on success; it only returns on failure.
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <form action={handleSubmit} className="glass w-full max-w-sm rounded-2xl p-8">
      <h1 className="text-center font-display text-xl text-ink">تسجيل الدخول للوحة التحكم</h1>
      <p className="mt-1 text-center text-xs text-ink-muted">هذه الصفحة مخصصة للمشرف فقط</p>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm text-ink-muted">البريد الإلكتروني</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink outline-none focus:border-electric-soft" />
        </div>
        <div>
          <label className="text-sm text-ink-muted">كلمة المرور</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink outline-none focus:border-electric-soft" />
        </div>
        <button type="submit" disabled={pending} className="mt-2 rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-sm font-medium text-white shadow-glow disabled:opacity-60">
          {pending ? "جاري الدخول…" : "دخول"}
        </button>
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </div>
    </form>
  );
}
