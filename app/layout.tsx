import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: "Survey PoC",
  description: "Survey Proof of Concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
