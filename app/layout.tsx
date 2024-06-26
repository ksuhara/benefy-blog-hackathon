import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const title = "Benefy Blog – NFTゲート機能を持ったブログ用CMS";
const description =
  "Benefy BlogはNFT保有者限定で閲覧できるコンテンツを簡単に作成できるCMSです。無料で始められます。";
const image = "https://benefy.blog/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://benefy.blog/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@vercel",
  },
  metadataBase: new URL("https://benefy.blog"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
