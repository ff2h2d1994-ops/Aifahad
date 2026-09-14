export function buildWhatsAppUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966531166659";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function serviceRequestMessage(opts: {
  serviceName?: string;
  clientName?: string;
  details?: string;
}) {
  const lines = ["السلام عليكم فهد،", "أرغب في طلب الخدمة التالية:"];
  if (opts.serviceName) lines.push(opts.serviceName);
  if (opts.clientName) lines.push("", "الاسم:", opts.clientName);
  if (opts.details) lines.push("", "تفاصيل الطلب:", opts.details);
  return lines.join("\n");
}

export function simpleServiceMessage(serviceName: string) {
  return `السلام عليكم فهد، شاهدت موقعك وأرغب في طلب خدمة: ${serviceName}`;
}
