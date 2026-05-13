import { Outfit, Playfair_Display } from "next/font/google";
import "@/index.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL('https://writings.page'),
  title: "Writings | The Living OS for Writers",
  description: "Craft your narratives in a minimalist, high-fidelity environment designed for deep focus and elegant publication.",
  keywords: ["writing software", "minimalist editor", "writer portfolio", "author platform", "publishing tools"],
  authors: [{ name: "Writings Team" }],
  openGraph: {
    title: "Writings | The Living OS for Writers",
    description: "Craft your narratives in a minimalist, high-fidelity environment designed for deep focus and elegant publication.",
    url: 'https://writings.page',
    siteName: 'Writings',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Writings - The Living OS for Writers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writings | The Living OS for Writers',
    description: 'Craft your narratives in a minimalist, high-fidelity environment designed for deep focus and elegant publication.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Writings',
  operatingSystem: 'Any',
  applicationCategory: 'DesignApplication',
  description: 'A minimalist, high-fidelity environment designed for deep focus and elegant publication.',
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
