"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/types";

export const dictionary = {
  ar: {
    nav_home: "الرئيسية",
    nav_services: "الخدمات",
    nav_portfolio: "أعمالي",
    nav_about: "من أنا",
    nav_contact: "تواصل",
    cta_portfolio: "شاهد أعمالي",
    cta_request: "اطلب خدمتك الآن",
    cta_custom: "اطلب خدمة مخصصة",
    cta_details: "عرض التفاصيل",
    cta_order: "اطلب هذه الخدمة",
    cta_related_work: "شاهد أعمال مرتبطة",
    custom_title: "لديك طلب مختلف؟",
    custom_subtitle: "أخبرني بما تحتاج",
    contact_section_title: "تواصل معي وابدأ مشروعك",
    footer_tagline: "أفكار اليوم.. تصنع نجاحك غداً",
    qr_title: "امسح الكود",
    qr_subtitle: "لمشاهدة الأعمال وطلب خدمتك",
    request_form_title: "طلب خدمة جديدة",
    lang_toggle: "English",
  },
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_portfolio: "Portfolio",
    nav_about: "About",
    nav_contact: "Contact",
    cta_portfolio: "View my work",
    cta_request: "Request your service",
    cta_custom: "Request a custom service",
    cta_details: "View details",
    cta_order: "Order this service",
    cta_related_work: "See related work",
    custom_title: "Have something different in mind?",
    custom_subtitle: "Tell me what you need",
    contact_section_title: "Get in touch and start your project",
    footer_tagline: "Today's ideas build tomorrow's success",
    qr_title: "Scan the code",
    qr_subtitle: "to view my work and request your service",
    request_form_title: "New service request",
    lang_toggle: "العربية",
  },
} as const;

type Dict = { [K in keyof typeof dictionary["ar"]]: string };

const LanguageContext = createContext<{
  locale: Locale;
  t: Dict;
  toggle: () => void;
  setLocale: (l: Locale) => void;
}>({
  locale: "ar",
  t: dictionary.ar,
  toggle: () => {},
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "ar" || saved === "en") applyLocale(saved);
  }, []);

  function applyLocale(l: Locale) {
    setLocaleState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("locale", l);
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        t: dictionary[locale],
        toggle: () => applyLocale(locale === "ar" ? "en" : "ar"),
        setLocale: applyLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}
