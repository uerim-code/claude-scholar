"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

export default function TerminalPage() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content:
        "Claude Scholar Terminal v1.0\nKomutları buradan çalıştırabilirsiniz.\nÖrnek: /research-init, /analyze-results, /commit\n",
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = async () => {
    if (!input.trim() || isRunning) return;
    const cmd = input.trim();
    setInput("");
    setLines((prev) => [...prev, { type: "input", content: `$ ${cmd}` }]);
    setIsRunning(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      if (data.error) {
        setLines((prev) => [
          ...prev,
          { type: "error", content: data.error },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { type: "output", content: data.output || "Komut tamamlandı." },
        ]);
      }
    } catch {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          content: "Bağlantı hatası - Backend API'ye ulaşılamadı.",
        },
      ]);
    }
    setIsRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Terminal</h1>
          <p className="text-[var(--text-secondary)]">
            Claude Scholar komutlarını doğrudan çalıştırın
          </p>
        </div>
        <button
          onClick={() =>
            setLines([
              {
                type: "output",
                content: "Terminal temizlendi.\n",
              },
            ])
          }
          className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:border-[var(--danger)] transition-all cursor-pointer"
        >
          <Trash2 size={14} />
          Temizle
        </button>
      </div>

      {/* Terminal Window */}
      <div className="bg-[#0d1117] rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[var(--text-muted)] ml-2 font-mono">
            claude-scholar ~ terminal
          </span>
        </div>

        {/* Output */}
        <div className="h-[500px] overflow-y-auto p-4 font-mono text-sm">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "input"
                  ? "text-[var(--accent)] mb-1"
                  : line.type === "error"
                    ? "text-[var(--danger)] mb-1"
                    : "text-green-400 mb-1 whitespace-pre-wrap"
              }
            >
              {line.content}
            </div>
          ))}
          {isRunning && (
            <div className="text-[var(--warning)] animate-pulse">
              Çalıştırılıyor...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[#161b22]">
          <span className="text-[var(--accent)] font-mono text-sm">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Komut girin..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono focus:outline-none"
            disabled={isRunning}
          />
          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--accent)] cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <h3 className="text-sm font-semibold mb-3">Hızlı Komutlar</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "/research-init",
            "/analyze-results",
            "/plan",
            "/commit",
            "/code-review",
            "/tdd",
            "/rebuttal",
            "/presentation",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd);
              }}
              className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
