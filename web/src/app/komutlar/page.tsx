"use client";
import { useState } from "react";
import { commands } from "@/lib/data";
import { Search, Play, Terminal, Copy, Check } from "lucide-react";
import { clsx } from "clsx";

const categories = ["Tümü", "Araştırma", "Geliştirme", "SuperClaude"];

export default function CommandsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);

  const filtered = commands.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.command.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Tümü" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce(
    (acc, c) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category].push(c);
      return acc;
    },
    {} as Record<string, typeof commands>
  );

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRun = async (command: string, id: string) => {
    setRunningId(id);
    setOutput(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "Komut çalıştırıldı");
    } catch {
      setOutput("Bağlantı hatası - Backend çalışıyor mu?");
    }
    setRunningId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Komutlar</h1>
        <p className="text-[var(--text-secondary)]">
          {commands.length} komut - Araştırma ve geliştirme iş akışlarını tek
          tıkla çalıştırın
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Komut ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                activeCategory === cat
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Output Panel */}
      {output && (
        <div className="bg-[#0d1117] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Çıktı
            </span>
            <button
              onClick={() => setOutput(null)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Kapat
            </button>
          </div>
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {/* Commands */}
      {Object.entries(grouped).map(([category, categoryCommands]) => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Terminal size={18} className="text-[var(--accent)]" />
            {category}
            <span className="text-xs text-[var(--text-muted)] font-normal">
              ({categoryCommands.length})
            </span>
          </h2>
          <div className="space-y-2 mb-8">
            {categoryCommands.map((cmd) => (
              <div
                key={cmd.id}
                className="card-hover bg-[var(--bg-card)] rounded-lg border border-[var(--border)] px-5 py-4 flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-[var(--accent)] font-medium">
                      {cmd.command}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {cmd.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {cmd.description}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(cmd.command, cmd.id)}
                    className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer"
                    title="Kopyala"
                  >
                    {copiedId === cmd.id ? (
                      <Check size={14} className="text-[var(--success)]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleRun(cmd.command, cmd.id)}
                    disabled={runningId === cmd.id}
                    className={clsx(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2",
                      runningId === cmd.id
                        ? "bg-[var(--warning)] text-black"
                        : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                    )}
                  >
                    <Play size={12} />
                    {runningId === cmd.id ? "Çalışıyor..." : "Çalıştır"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
