import { hooks, rules } from "@/lib/data";
import {
  Webhook,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Lock,
  FileCode2,
  ToggleLeft,
} from "lucide-react";

export default function HooksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hooklar & Kurallar</h1>
        <p className="text-[var(--text-secondary)]">
          Otomatik tetikleyiciler ve global kısıtlamalar
        </p>
      </div>

      {/* Hooks */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Webhook size={20} className="text-[var(--accent)]" />
          Hooklar
          <span className="text-sm text-[var(--text-muted)] font-normal">
            (5 otomatik tetikleyici)
          </span>
        </h2>
        <div className="space-y-3">
          {hooks.map((hook) => (
            <div
              key={hook.name}
              className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                    {hook.name.includes("security") ? (
                      <Lock size={18} className="text-[var(--danger)]" />
                    ) : hook.name.includes("session-start") ? (
                      <Clock size={18} className="text-[var(--success)]" />
                    ) : hook.name.includes("skill") ? (
                      <AlertTriangle
                        size={18}
                        className="text-[var(--warning)]"
                      />
                    ) : (
                      <FileCode2 size={18} className="text-[var(--accent)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                      {hook.name}
                    </h3>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] mt-1 mb-2">
                      {hook.trigger}
                    </span>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {hook.description}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--text-muted)]">
                  <ToggleLeft size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-[var(--warning)]" />
          Kurallar
          <span className="text-sm text-[var(--text-muted)] font-normal">
            (4 global kısıtlama)
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.file}
              className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                  <ShieldCheck size={18} className="text-[var(--warning)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {rule.name}
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {rule.file}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
