import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color - Live Design System Generator",
  description:
    "Generate accessible, mathematically harmonious design systems in real time with OKLCH perceptual curves, APCA contrast verification, and live production templates by codefrydev.",
  keywords: [
    "color palette generator",
    "design systems",
    "oklch",
    "design tokens",
    "wcag 2.2",
    "apca",
    "tailwind tokens",
    "shadcn theme generator",
  ],
  authors: [{ name: "codefrydev" }],
  openGraph: {
    title: "Color - Live Design System Generator",
    description:
      "Generate accessible, mathematically harmonious design systems in real time with Color by codefrydev.",
    url: "https://codefrydev.in/color",
    siteName: "Color",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color - Live Design System Generator",
    description:
      "Generate accessible, mathematically harmonious design systems in real time with Color by codefrydev.",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
