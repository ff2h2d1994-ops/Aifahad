"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logPageView } from "@/lib/actions/analytics";

// Renders nothing — just fires a lightweight view log whenever the
// visitor lands on a new page. Lives once in the public (site) layout.
export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  return null;
}
