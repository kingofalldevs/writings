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
  title: "Writings | The Living OS for Writers",
  description: "Craft your narratives in a minimalist, high-fidelity environment designed for deep focus and elegant publication.",
  openGraph: {
    title: "Writings | The Living OS for Writers",
    description: "Craft your narratives in a minimalist, high-fidelity environment designed for deep focus and elegant publication.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
