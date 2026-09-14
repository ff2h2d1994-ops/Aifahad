import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CertificateSection } from "@/components/CertificateSection";
import { QRCodeSection } from "@/components/QRCodeSection";
import { getServices, getLogoUrl, getHeroText, getSiteSetting, getCustomButtons } from "@/lib/data/fetch";
import { getAuthorizedUser } from "@/lib/utils";

export default async function HomePage() {
  const [services, logoUrl, heroText, certificate, customButtons, admin] = await Promise.all([
    getServices(),
    getLogoUrl(),
    getHeroText(),
    getSiteSetting("certificate", { visible: true, verify_url: "" }),
    getCustomButtons(),
    getAuthorizedUser(),
  ]);

  return (
    <>
      <Hero logoUrl={logoUrl} heroText={heroText as any} customButtons={customButtons} />
      <ServicesGrid services={services} isAdmin={!!admin} />
      {(certificate as any).visible && <CertificateSection verifyUrl={(certificate as any).verify_url} />}
      <QRCodeSection />
    </>
  );
}
