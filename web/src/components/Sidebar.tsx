"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Sparkles,
  Terminal,
  Bot,
  GitBranch,
  Settings,
  Zap,
  Shield,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Kontrol Paneli", icon: LayoutDashboard },
  { href: "/yetenekler", label: "Yetenekler", icon: Sparkles },
  { href: "/komutlar", label: "Komutlar", icon: Terminal },
  { href: "/ajanlar", label: "Ajanlar", icon: Bot },
  { href: "/arastirma", label: "Arastirma Akisi", icon: GitBranch },
  { href: "/hooklar", label: "Hooklar & Kurallar", icon: Shield },
  { href: "/terminal", label: "Terminal", icon: Zap },
  { href: "/kilavuz", label: "Kullanma Kilavuzu", icon: HelpCircle },
  { href: "/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col z-50">
      <div className="p-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)] m-0">
              Claude Scholar
            </h1>
            <p className="text-xs text-[var(--text-muted)] m-0">
              Araştırma Asistanı
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm no-underline transition-all",
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--accent-hover)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            Sistem Aktif
          </div>
          <div className="mb-2">v1.0 - Claude Scholar</div>
          <a
            href="https://github.com/Galaxy-Dawn/claude-scholar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline text-[10px]"
          >
            Galaxy-Dawn/claude-scholar
          </a>
        </div>
      </div>
    </aside>
  );
}
