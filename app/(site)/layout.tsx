import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/WhatsAppButton";
import { ViewTracker } from "@/components/ViewTracker";
import { getContact, getLogoUrl, getNavMenu } from "@/lib/data/fetch";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, logoUrl, navItems] = await Promise.all([getContact(), getLogoUrl(), getNavMenu()]);

  return (
    <>
      <ViewTracker />
      <Header logoUrl={logoUrl} navItems={navItems} />
      <main className="min-h-screen">{children}</main>
      <Footer contact={contact} />
      <StickyWhatsApp />
    </>
  );
}
