import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "HireLoop | Practice Real AI Interviews | Get Hired Faster",
  description: "Master coding, behavioral, and technical interviews with AI. Practice in a real-time code editor, receive instant feedback, downloadable PDF reports, personalized interview tracks, and land your dream job with HireLoop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen bg-dark text-text font-sans selection:bg-primary/30 overflow-x-hidden relative">
          {children}
        </div>
      </body>
    </html>
  );
}
