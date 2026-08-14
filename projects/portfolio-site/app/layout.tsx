import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jasmine Hoang - Portfolio",
  description: "UI/UX Designer & Developer based in San Francisco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme registers portfolio as a real Theme in the DS's mechanism
    // (Option B) - even though nothing in the DS's own `theme` cascade layer
    // is populated for it today, since portfolio uses its own semantic
    // vocabulary (--color-ink etc, not the DS's --color-text-primary etc.),
    // not the DS's semantic tokens directly. This keeps the identification
    // consistent with meal-prep and leaves the door open if that changes.
    //
    // No data-mode: unlike meal-prep, there's no dark-mode design for
    // portfolio anywhere (no dark palette, no toggle, nothing) - an
    // explicit decision to stay light-only for now, not an oversight.
    <html lang="en" data-theme="portfolio" className="scroll-smooth">
      <body
        className={`${amiri.variable} font-serif antialiased bg-canvas text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
