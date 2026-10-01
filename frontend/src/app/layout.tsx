import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AudioNotes - AI Audio Transcription & Summarization",
  description: "Upload any audio file and get AI-powered transcription and smart summaries in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="py-8 text-center text-sm text-slate-400 font-medium border-t border-white/5 bg-slate-900/20 backdrop-blur-sm">
            Built with 💻 by <a href="https://github.com/prateek31-ops" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Prateek Suthar</a>
          </footer>
        </div>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
