import type { Metadata } from "next";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مكتبة MegaCNC | أكثر من 10000 نموذج CNC احترافي جاهز للتحميل",
  description: "احصل على مكتبة MegaCNC التي تضم أكثر من 10000 نموذج CNC احترافي للأبواب والزخارف والمرايا والديكور و3D Relief. تحميل فوري وتنظيم احترافي يساعدك على تسريع الإنجاز وزيادة المبيعات.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-cairo">{children}</body>
    </html>
  );
}
