"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLocale } from "./LanguageProvider";
import { buildWhatsAppUrl, simpleServiceMessage } from "@/lib/whatsapp";
import type { CustomButton } from "@/types";

type HeroText = { title_ar: string; subtitle_ar: string; tagline_ar: string };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export function Hero({ logoUrl, heroText, customButtons = [] }: { logoUrl: string; heroText: HeroText; customButtons?: CustomButton[] }) {
  const { t, locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 15 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const motionProps = reduced
    ? {}
    : { initial: "hidden", animate: "show", variants: fadeUp };

  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full holo-ring" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          className="relative mb-8"
          {...motionProps}
          custom={0}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -14, 0] }}
            transition={reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              ref={ref}
              onPointerMove={handleMove}
              onPointerLeave={() => {
                mx.set(0);
                my.set(0);
              }}
              className="[perspective:800px]"
            >
              <motion.div style={{ rotateX, rotateY }} className="relative h-44 w-44 md:h-64 md:w-64">
                <Image src={logoUrl} alt="Fahad Almishan" fill priority className="object-contain drop-shadow-[0_0_55px_rgba(62,123,255,0.55)]" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.h2
          className="font-display text-2xl font-semibold tracking-wide text-ink-muted md:text-4xl"
          {...motionProps}
          custom={1}
        >
          {locale === "ar" ? "فهد المشعان" : "FAHAD ALMISHAN"}
        </motion.h2>
        <motion.p className="mt-2 text-sm text-ink-muted md:text-base" {...motionProps} custom={2}>
          {locale === "ar" ? "مهندس برمجيات · خبير في عالم الذكاء الاصطناعي" : "Software Engineer · AI Specialist"}
        </motion.p>

        <motion.h1
          className="mt-8 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl"
          {...motionProps}
          custom={3}
        >
          <span className="text-gradient text-gradient-animated">{heroText.title_ar}</span>
        </motion.h1>
        <motion.p className="mt-4 max-w-xl text-base text-ink-muted md:text-lg" {...motionProps} custom={4}>
          {heroText.subtitle_ar}
        </motion.p>

        <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" {...motionProps} custom={5}>
          <Link
            href="/portfolio"
            className="rounded-full border border-black/15 bg-black/5 px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-black/10"
          >
            {t.cta_portfolio}
          </Link>
          <a
            href={buildWhatsAppUrl(simpleServiceMessage("استفسار عام"))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-electric to-violet px-7 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
          >
            {t.cta_request}
          </a>
        </motion.div>

        <motion.p className="mt-8 text-xs text-ink-muted/70" {...motionProps} custom={6}>
          {heroText.tagline_ar}
        </motion.p>

        {customButtons.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {customButtons.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  b.style === "primary"
                    ? "rounded-full bg-gradient-to-r from-electric to-violet px-6 py-2.5 text-sm font-medium text-white shadow-glow"
                    : "rounded-full border border-black/15 bg-black/5 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/10"
                }
              >
                {b.label_ar}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
