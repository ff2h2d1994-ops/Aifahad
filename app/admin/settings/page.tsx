import { getContact, getHeroText, getLogoUrl, getSiteSetting, getAllNavMenu, getThemeColors, getCustomButtons, getPaymentMethods } from "@/lib/data/fetch";
import { ContactSettingsForm, HeroSettingsForm, LogoSettingsForm, CertificateSettingsForm, PaymentSettingsForm } from "@/components/admin/SettingsForms";
import { NavMenuEditor } from "@/components/admin/NavMenuEditor";
import { ThemeColorEditor } from "@/components/admin/ThemeColorEditor";
import { CustomButtonsEditor } from "@/components/admin/CustomButtonsEditor";

export default async function AdminSettingsPage() {
  const [contact, hero, logoUrl, certificate, navItems, themeColors, customButtons, payment] = await Promise.all([
    getContact(),
    getHeroText(),
    getLogoUrl(),
    getSiteSetting("certificate", { visible: true, verify_url: "" }),
    getAllNavMenu(),
    getThemeColors(),
    getCustomButtons(),
    getPaymentMethods(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-ink">الإعدادات</h1>
      <LogoSettingsForm logoUrl={logoUrl} />
      <ThemeColorEditor colors={themeColors} />
      <NavMenuEditor items={navItems} />
      <CustomButtonsEditor buttons={customButtons} />
      <PaymentSettingsForm payment={payment} />
      <HeroSettingsForm hero={hero as any} />
      <ContactSettingsForm contact={contact} />
      <CertificateSettingsForm certificate={certificate as any} />
    </div>
  );
}
