import type { Metadata } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaara's 17th Birthday",
  description: "Photobooth for Zaara's Birthday",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dancingScript.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fdf2f8] overflow-hidden overscroll-none text-[#4a154b]">
        {children}
      </body>
    </html>
  );
}
