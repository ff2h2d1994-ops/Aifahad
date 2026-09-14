import { createClient } from "@/lib/supabase/server";
import { FALLBACK_SERVICES } from "@/lib/data/services";
import type { Project, Service, SiteContact, NavItem, ThemeColors, CustomButton, PaymentMethods } from "@/types";

const DEFAULT_CONTACT: SiteContact = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966531166659",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ff2h2d1994@gmail.com",
  instagram: "ff2h2d",
  snapchat: "ff2h2d",
  x: "ff2h2d",
};

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_SERVICES;
    return data as Service[];
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) || null;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });
    if (error || !data) return [];
    return data as Project[];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").eq("slug", slug).eq("visible", true).single();
    return (data as Project) || null;
  } catch {
    return null;
  }
}

export async function getSiteSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).single();
    return (data?.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getContact(): Promise<SiteContact> {
  return getSiteSetting<SiteContact>("contact", DEFAULT_CONTACT);
}

export async function getLogoUrl(): Promise<string> {
  return getSiteSetting<string>("logo_url", "/logo.png");
}

export async function getHeroText() {
  return getSiteSetting("hero_text", {
    title_ar: "كل ما تحتاجه في مكان واحد",
    subtitle_ar: "خدمات احترافية بقوة الذكاء الاصطناعي",
    tagline_ar: "أفكار اليوم.. تصنع نجاحك غداً",
  });
}

const DEFAULT_NAV: NavItem[] = [
  { id: "home", label_ar: "الرئيسية", label_en: "Home", href: "/", visible: true, order_index: 1 },
  { id: "services", label_ar: "الخدمات", label_en: "Services", href: "/services", visible: true, order_index: 2 },
  { id: "portfolio", label_ar: "أعمالي", label_en: "Portfolio", href: "/portfolio", visible: true, order_index: 3 },
  { id: "reviews", label_ar: "التقييمات", label_en: "Reviews", href: "/reviews", visible: true, order_index: 4 },
  { id: "about", label_ar: "من أنا", label_en: "About", href: "/about", visible: true, order_index: 5 },
  { id: "contact", label_ar: "تواصل", label_en: "Contact", href: "/contact", visible: true, order_index: 6 },
];

export async function getNavMenu(): Promise<NavItem[]> {
  const items = await getSiteSetting<NavItem[]>("nav_menu", DEFAULT_NAV);
  return [...items].filter((i) => i.visible).sort((a, b) => a.order_index - b.order_index);
}

export async function getAllNavMenu(): Promise<NavItem[]> {
  // Unfiltered — used by the admin editor so hidden items still show up.
  const items = await getSiteSetting<NavItem[]>("nav_menu", DEFAULT_NAV);
  return [...items].sort((a, b) => a.order_index - b.order_index);
}

const DEFAULT_THEME: ThemeColors = {
  electric: "#C9A227",
  violet: "#8B6A2E",
  cyan: "#E8CE8B",
  ember: "#B5651D",
};

export async function getThemeColors(): Promise<ThemeColors> {
  return getSiteSetting<ThemeColors>("theme_colors", DEFAULT_THEME);
}

export async function getCustomButtons(): Promise<CustomButton[]> {
  return getSiteSetting<CustomButton[]>("custom_buttons", []);
}

export async function getApprovedReviews() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    // Table may not exist yet if schema.sql hasn't been re-run — fail
    // quietly instead of crashing the page.
    return [];
  }
}

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  show: false, // off until the admin fills in real payment details
  stc_pay: "",
  bank_name: "",
  iban: "",
  account_holder: "",
};

export async function getPaymentMethods(): Promise<PaymentMethods> {
  return getSiteSetting<PaymentMethods>("payment_methods", DEFAULT_PAYMENT_METHODS);
}
