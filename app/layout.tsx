import type { Metadata } from "next";
import "./globals.scss";
import Header from "./header";

export const revalidate = 0;

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
      <body>
        <Header />
        <div className="layout">{children}</div>
      </body>
    </html>
  );
}
