import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import LivePanel from "@/components/LivePanel";
import { CommandRunnerProvider } from "@/lib/command-runner";

export const metadata: Metadata = {
  title: "Claude Scholar - Arastirma Asistani",
  description: "Akademik arastirma ve gelistirme icin yari otomatik asistan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <CommandRunnerProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen p-8 pb-32">{children}</main>
          <LivePanel />
        </CommandRunnerProvider>
      </body>
    </html>
  );
}
