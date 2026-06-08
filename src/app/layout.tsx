import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { FooterLoader } from "@/components/layout/footer-loader";
import { AppToaster } from "@/components/shared/app-toaster";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-fraunces", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Yaclam (يعلم) — Learn Without Limits",
    template: "%s · Yaclam",
  },
  description:
    "Yaclam is the leading Somali-language e-learning platform. Master practical skills, earn certificates, discover scholarships and advance your career through expert-led Somali-language education.",
  keywords: ["Somali courses", "e-learning Somali", "scholarships", "data analytics Somali", "Yaclam"],
  openGraph: {
    title: "Yaclam (يعلم) — Learn Without Limits",
    description: "Somali-language courses, scholarships and career roadmaps.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${fraunces.variable} ${amiri.variable}`}>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <AppToaster />
        <Navbar />
        <main>{children}</main>
        <FooterLoader />
      </body>
    </html>
  );
}
