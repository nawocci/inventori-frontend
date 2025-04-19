import type { Metadata } from "next";
import NavigationWrapper from "@/components/NavigationWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Inventori Nantech",
  description: "Inventory System for Nantech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
