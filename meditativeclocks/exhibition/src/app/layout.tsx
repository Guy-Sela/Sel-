import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const josefin = localFont({
  src: "./fonts/josefin-sans.woff2",
  variable: "--font-josefin",
  display: "block",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "block",
});

export const metadata: Metadata = {
  title: "Conceptual Timing | Selà",
  description:
    "A collection of meditative clocks. Each piece deconstructs the concept of time differently.",
  openGraph: {
    title: "Conceptual Timing | Selà",
    description: "A collection of meditative clocks by Selà",
    type: "website",
    images: ["https://selà.com/og-1200x630.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conceptual Timing | Selà",
    description: "A collection of meditative clocks by Selà",
    images: ["https://selà.com/og-1200x630.png"],
  },
  icons: {
    icon: "https://selà.com/favicons/experiments/favicon_gold.ico",
    shortcut: "https://selà.com/favicons/experiments/favicon_gold.ico",
    apple: "https://selà.com/favicons/experiments/chevron_gold_180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${josefin.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                  href="/conceptual-timing"
                  className="font-josefin text-lg tracking-wide hover:opacity-70 transition-opacity"
                >
                  SELÀ
                </Link>
                <nav className="flex items-center gap-6">
                  <Link
                    href="/conceptual-timing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Collection
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="pt-16">{children}</main>
            <footer className="py-12 mt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Selà. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <a
                      href="https://selà.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Main Site
                    </a>
                    <a
                      href="mailto:ops@selahq.com"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
