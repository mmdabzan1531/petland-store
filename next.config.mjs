/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // مرورگر همیشه آخرین نسخه‌ی صفحه‌ها را از سرور بپرسد (بعد از دیپلوی، رفرش کروم تغییرات را نشان بدهد)
  async headers() {
    return [
      { source: "/((?!_next/static|_next/image).*)", headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }] },
    ];
  },
};
export default nextConfig;
