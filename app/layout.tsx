import OHeader from "@/organisms/o-header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const revalidate = 0;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WMN",
  description: "WMN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl-PL">
      <body className={inter.className}>
        <OHeader />
        <div className="layout">{children}</div>
        <SpeedInsights />
      </body>
    </html>
  );
}
