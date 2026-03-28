"use client";
import { useState } from "react";
import { useCommandRunner } from "@/lib/command-runner";
import { Play, Loader2, X, Send } from "lucide-react";
import { clsx } from "clsx";

interface RunButtonProps {
  command: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  noInput?: boolean;
}

export default function RunButton({
  command,
  label,
  variant = "primary",
  size = "sm",
  className,
  children,
  placeholder,
  noInput = false,
}: RunButtonProps) {
  const { runCommand, isRunning, currentCommand } = useCommandRunner();
  const isThisRunning = isRunning && currentCommand === command;
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  const handleClick = () => {
    if (noInput) {
      runCommand(command, label);
      return;
    }
    setShowInput(true);
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      runCommand(command, label);
    } else {
      runCommand(command, label, input.trim());
    }
    setShowInput(false);
    setInput("");
  };

  const baseStyles = "inline-flex items-center gap-1.5 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg",
    secondary: "bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] rounded-lg",
    ghost: "text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg",
    icon: "p-2 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white",
  };

  const sizes = {
    sm: variant === "icon" ? "p-2" : "px-3 py-1.5 text-xs",
    md: variant === "icon" ? "p-2.5" : "px-4 py-2 text-sm",
  };

  // Input modal overlay
  if (showInput) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowInput(false)}>
        <div
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-lg mx-4 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{label}</h3>
              <code className="text-xs text-[var(--accent)]">{command}</code>
            </div>
            <button
              onClick={() => setShowInput(false)}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Input */}
          <div className="p-5">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Ne yapmak istiyorsunuz?
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={placeholder || `Ornek: "${getPlaceholder(command)}"`}
              className="w-full h-28 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
              autoFocus
            />
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
              Enter ile gonderin. Bos birakirsaniz varsayilan gorev calisir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] rounded-b-2xl">
            <button
              onClick={() => setShowInput(false)}
              className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer rounded-lg hover:bg-[var(--bg-hover)]"
            >
              Iptal
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              <Send size={14} />
              Calistir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isRunning}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      title={`Calistir: ${command}`}
    >
      {isThisRunning ? (
        <Loader2 size={size === "sm" ? 12 : 14} className="animate-spin" />
      ) : (
        <Play size={size === "sm" ? 12 : 14} />
      )}
      {children || (variant !== "icon" && (isThisRunning ? "Calisiyor..." : label))}
    </button>
  );
}

function getPlaceholder(command: string): string {
  const placeholders: Record<string, string> = {
    "/research-init": "Transformer mimarilerinde verimlilik optimizasyonu konusunu arastir",
    "/analyze-results": "CIFAR-10 uzerinde ResNet ve ViT karsilastirma sonuclarini analiz et",
    "/rebuttal": "Reviewer 2 nin deneysel yetersizlik elestirisi icin yanit hazirla",
    "/presentation": "NeurIPS 2025 icin 15 dakikalik sunum taslagi olustur",
    "/poster": "A0 boyutunda akademik poster tasarla",
    "/promote": "Twitter ve LinkedIn icin makale tanitim icerigi olustur",
    "/plan": "Yeni bir attention mekanizmasi icin uygulama plani olustur",
    "/commit": "Mevcut degisiklikleri commit et",
    "/code-review": "Son degisiklikleri incele",
    "/tdd": "Veri yukleyici modulu icin test odakli gelistirme baslat",
    "/build-fix": "Mevcut build hatalarini duzelt",
    "/obsidian-init": "Bu proje icin Obsidian bilgi tabani olustur",
    "/obsidian-sync": "Proje ve Obsidian arasinda senkronize et",
    "/zotero-review": "Son eklenen makaleleri oku ve sentezle",
    "/zotero-notes": "Koleksiyondaki makaleler icin detayli notlar olustur",
    "/sc analyze": "Bu projenin kod kalitesini analiz et",
    "/sc brainstorm": "Yeni ozellik fikirleri icin beyin firtinasi yap",
    "/sc test": "Mevcut testleri calistir ve sonuclari raporla",
    "/sc implement": "Belirtilen ozelligi uygulamaya basla",
  };
  return placeholders[command] || "Gorev detaylarini yazin...";
}
