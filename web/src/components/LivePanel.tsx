"use client";
import { useCommandRunner } from "@/lib/command-runner";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Terminal,
  X,
} from "lucide-react";
import { clsx } from "clsx";

export default function LivePanel() {
  const { logs, isRunning, currentCommand, clearLogs, panelOpen, setPanelOpen } =
    useCommandRunner();

  if (!panelOpen && logs.length === 0) return null;

  return (
    <>
      {/* Floating Status Bar - always visible when running */}
      {isRunning && !panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--accent)] text-white rounded-xl shadow-lg cursor-pointer animate-pulse"
        >
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm font-medium">{currentCommand}</span>
        </button>
      )}

      {/* Mini bar when closed but has logs */}
      {!panelOpen && logs.length > 0 && !isRunning && (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl shadow-lg cursor-pointer hover:border-[var(--accent)] transition-all"
        >
          <Terminal size={16} className="text-[var(--accent)]" />
          <span className="text-sm">{logs.length} islem</span>
          <ChevronUp size={14} />
        </button>
      )}

      {/* Full Panel */}
      {panelOpen && (
        <div className="fixed bottom-0 left-64 right-0 z-50 bg-[#0d1117] border-t border-[var(--border)] shadow-2xl flex flex-col" style={{ maxHeight: "45vh" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[var(--border)] shrink-0">
            <div className="flex items-center gap-3">
              <Terminal size={16} className="text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Canli Cikti
              </span>
              {isRunning && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--warning)]">
                  <Loader2 size={12} className="animate-spin" />
                  Calisiyor: {currentCommand}
                </span>
              )}
              {!isRunning && logs.length > 0 && (
                <span className="text-xs text-[var(--text-muted)]">
                  {logs.length} islem
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearLogs}
                className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Temizle"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Kapat"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {logs.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                Henuz bir komut calistirilmadi. Bir dugmeye tiklayin.
              </div>
            )}
            {logs.map((log) => (
              <div
                key={log.id}
                className={clsx(
                  "rounded-lg border p-3 animate-fade-in",
                  log.status === "running"
                    ? "border-[var(--accent)] bg-[rgba(99,102,241,0.05)]"
                    : log.status === "success"
                      ? "border-[var(--success)] bg-[rgba(34,197,94,0.03)]"
                      : "border-[var(--danger)] bg-[rgba(239,68,68,0.03)]"
                )}
              >
                {/* Log Header */}
                <div className="flex items-center gap-2 mb-1.5">
                  {log.status === "running" ? (
                    <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                  ) : log.status === "success" ? (
                    <CheckCircle size={14} className="text-[var(--success)]" />
                  ) : (
                    <XCircle size={14} className="text-[var(--danger)]" />
                  )}
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {log.label}
                  </span>
                  <code className="text-[10px] text-[var(--accent)] bg-[var(--accent-light)] px-1.5 py-0.5 rounded">
                    {log.command}
                  </code>
                  <span className="text-[10px] text-[var(--text-muted)] ml-auto">
                    {log.timestamp.toLocaleTimeString("tr-TR")}
                  </span>
                </div>

                {/* Output */}
                {log.status === "running" ? (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    Komut isleniyor...
                  </div>
                ) : (
                  <pre className={clsx(
                    "text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto",
                    log.status === "success" ? "text-green-400" : "text-red-400"
                  )}>
                    {log.output}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
