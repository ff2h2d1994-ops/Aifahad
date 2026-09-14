import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getAuthorizedUser() {
  // Deliberately fail-safe: this now runs on every PUBLIC page (to decide
  // whether to show the admin-only upload button), so it must NEVER throw
  // and take down a visitor's page render — any failure just means "not
  // the admin," not a crash.
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
    return user;
  } catch {
    return null;
  }
}
