export type Locale = "ar" | "en";

export type Service = {
  id: string;
  slug: string;
  category: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  features_ar: string[];
  features_en: string[];
  price_min: number | null;
  price_max: number | null;
  price_note: string;
  show_price: boolean;
  order_index: number;
  visible: boolean;
};

export type MediaItem = {
  type: "image" | "video";
  url: string;
  thumbnail_url?: string;
  cover?: boolean;
};

export type BeforeAfter = {
  before_url: string;
  after_url: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  category: string;
  media: MediaItem[];
  before_after: BeforeAfter[];
  links: ProjectLink[];
  featured: boolean;
  visible: boolean;
  order_index: number;
  execution_date: string | null;
};

export type RequestStatus = "جديد" | "تم التواصل" | "قيد التنفيذ" | "مكتمل" | "ملغي";

export type ServiceRequest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  description: string;
  budget: string | null;
  deadline: string | null;
  files: { name: string; url: string }[];
  status: RequestStatus;
  internal_notes: string | null;
  ip_address: string | null;
  created_at: string;
};

export type SiteContact = {
  whatsapp: string;
  email: string;
  instagram: string;
  snapchat: string;
  x: string;
};

export type NavItem = {
  id: string;
  label_ar: string;
  label_en: string;
  href: string;
  visible: boolean;
  order_index: number;
};

export type ThemeColors = {
  electric: string;
  violet: string;
  cyan: string;
  ember: string;
};

export type CustomButton = {
  id: string;
  label_ar: string;
  url: string;
  style: "primary" | "secondary";
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string | null;
  approved: boolean;
  created_at: string;
};

export type PaymentMethods = {
  show: boolean;
  stc_pay: string;
  bank_name: string;
  iban: string;
  account_holder: string;
};
