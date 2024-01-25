import OHeader from "@/organisms/o-header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import OAutoRefresh from "@/organisms/o-autorefresh";

const inter = Inter({ subsets: ["latin"] });

const revalidate = true;

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
        {process.env.NODE_ENV === "production" && <OAutoRefresh />}
        <OHeader />
        <div className="layout">{children}</div>
        <SpeedInsights />
      </body>
    </html>
  );
}
