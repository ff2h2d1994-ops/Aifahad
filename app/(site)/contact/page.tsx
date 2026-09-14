import type { Metadata } from "next";
import { Instagram, Twitter, Mail, MessageCircle, Wallet, Landmark } from "lucide-react";
import { getContact, getPaymentMethods } from "@/lib/data/fetch";
import { CopyField } from "@/components/CopyField";

export const metadata: Metadata = {
  title: "تواصل معي",
  description: "تواصل مع فهد المشعان عبر واتساب، البريد الإلكتروني، أو حسابات التواصل الاجتماعي.",
};

export default async function ContactPage() {
  const [contact, payment] = await Promise.all([getContact(), getPaymentMethods()]);

  const items = [
    { icon: MessageCircle, label: "واتساب", value: contact.whatsapp, href: `https://wa.me/${contact.whatsapp}` },
    { icon: Mail, label: "البريد الإلكتروني", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Instagram, label: "Instagram", value: `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram}` },
    { icon: MessageCircle, label: "Snapchat", value: contact.snapchat, href: `https://snapchat.com/add/${contact.snapchat}` },
    { icon: Twitter, label: "X", value: `@${contact.x}`, href: `https://x.com/${contact.x}` },
  ];

  const showPayment = payment.show && (payment.stc_pay || payment.iban);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="text-center font-display text-3xl text-ink">تواصل معي وابدأ مشروعك</h1>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors hover:border-electric-soft/40"
          >
            <item.icon className="h-5 w-5 text-electric-soft" />
            <div>
              <p className="text-xs text-ink-muted">{item.label}</p>
              <p className="text-sm text-ink" dir="ltr">{item.value}</p>
            </div>
          </a>
        ))}
      </div>

      {showPayment && (
        <div className="glass mt-6 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-electric-soft" />
            <h2 className="font-display text-lg text-ink">طرق الدفع</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {payment.stc_pay && (
              <CopyField icon={Wallet} label="STC Pay" value={payment.stc_pay} />
            )}
            {payment.iban && (
              <CopyField
                icon={Landmark}
                label={`${payment.bank_name || "تحويل بنكي"}${payment.account_holder ? " · " + payment.account_holder : ""}`}
                value={payment.iban}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
