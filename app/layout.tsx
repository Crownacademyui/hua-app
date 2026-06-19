import type { Metadata } from "next";
import { Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";
import "./mobile.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hua — Goal Setting for African Freelancers",
  description: "Set goals, track progress, and build accountability habits. Built for African freelancers and small business owners.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Hua — Goal Setting for African Freelancers",
    description: "Set goals that actually get done.",
    type: "website",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
