import type { Metadata } from "next";
import Script from "next/script";
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
      <body className="min-h-full flex flex-col font-sans">
        {children}
        {/* Deferred Analytics & Tracking */}
        <Script
          id="deferred-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                  // Prevent the script from loading more than once
                  let trackingLoaded = false;

                  function loadTrackingScripts() {
                      if (trackingLoaded) return;
                      trackingLoaded = true;

                      // 1. Load Google Analytics (gtag.js)
                      const gaScript = document.createElement('script');
                      gaScript.async = true;
                      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-VM01Q3R43D';
                      document.head.appendChild(gaScript);

                      window.dataLayer = window.dataLayer || [];
                      function gtag() { dataLayer.push(arguments); }
                      gtag('js', new Date());
                      gtag('config', 'G-VM01Q3R43D');

                      // 2. Load Microsoft Clarity
                      (function(c,l,a,r,i,t,y){
                          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                      })(window, document, "clarity", "script", "mxr4hxioh4");

                      // Clean up event listeners once loaded
                      ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(event) {
                          window.removeEventListener(event, loadTrackingScripts);
                      });
                  }

                  // Attach event listeners to trigger the tracking
                  ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(event) {
                      window.addEventListener(event, loadTrackingScripts, { once: true, passive: true });
                  });

                  // Fallback: Load after 5 seconds even if the user does nothing (optional but recommended)
                  setTimeout(loadTrackingScripts, 5000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

