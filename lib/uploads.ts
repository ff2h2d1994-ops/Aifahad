// Mirrors the allowed_mime_types / file_size_limit set on the Supabase
// storage buckets in supabase/schema.sql. Checking here too gives the
// user instant feedback instead of waiting for the upload to fail —
// but the real enforcement is the Storage bucket config, since browsers
// upload directly to Storage.

export const MEDIA_RULES = {
  maxSizeBytes: 25 * 1024 * 1024, // 25 MB — bucket "media" (project images/video, logo)
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime", "video/webm"],
};

export const UPLOAD_RULES = {
  maxSizeBytes: 15 * 1024 * 1024, // 15 MB — bucket "uploads" (client reference files)
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
  ],
};

export function validateFile(file: File, rules: { maxSizeBytes: number; allowedTypes: string[] }): string | null {
  if (!rules.allowedTypes.includes(file.type)) {
    return `نوع الملف "${file.name}" غير مسموح به`;
  }
  if (file.size > rules.maxSizeBytes) {
    const maxMb = Math.round(rules.maxSizeBytes / (1024 * 1024));
    return `حجم الملف "${file.name}" أكبر من الحد المسموح (${maxMb} MB)`;
  }
  return null;
}
