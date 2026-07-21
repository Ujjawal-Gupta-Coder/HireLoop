import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireLoop - AI-Powered Interview Preparation Platform",
  description: "Master every interview with your AI-Powered copilot. HireLoop provides real-time feedback, behavioral analysis, and industry-specific simulations to help you land your dream offer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={'h-full antialiased'}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
