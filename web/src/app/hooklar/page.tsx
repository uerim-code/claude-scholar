"use client";
import { useEffect, useState, useCallback } from "react";
import { hooks, rules } from "@/lib/data";
import {
  Webhook,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Lock,
  FileCode2,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";

interface HookStatus {
  name: string;
  exists: boolean;
  path: string | null;
}

interface HookRunResult {
  status: "idle" | "running" | "success" | "error" | "not_found";
  output?: string;
  error?: string;
  timestamp?: string;
}

export default function HooksPage() {
  const [hookStatuses, setHookStatuses] = useState<HookStatus[]>([]);
  const [runResults, setRunResults] = useState<Record<string, HookRunResult>>({});
  const [autoRanSession, setAutoRanSession] = useState(false);

  // Hook durumlarini kontrol et
  const checkHookStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/hooks");
      const data = await res.json();
      setHookStatuses(data.hooks || []);
    } catch {
      // API baglantisi yok
    }
  }, []);

  // Tek bir hook calistir
  const runHook = useCallback(async (hookName: string, event: string) => {
    setRunResults((prev) => ({
      ...prev,
      [hookName]: { status: "running" },
    }));

    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: hookName, event }),
      });
      const data = await res.json();

      setRunResults((prev) => ({
        ...prev,
        [hookName]: {
          status: data.status === "success" ? "success" : data.status === "not_found" ? "not_found" : "error",
          output: data.output || data.message,
          error: data.error,
          timestamp: data.timestamp || new Date().toISOString(),
        },
      }));
    } catch {
      setRunResults((prev) => ({
        ...prev,
        [hookName]: {
          status: "error",
          error: "API baglantilamadi",
          timestamp: new Date().toISOString(),
        },
      }));
    }
  }, []);

  // Sayfa yuklendiginde otomatik session-start hook'unu calistir
  useEffect(() => {
    checkHookStatuses();
  }, [checkHookStatuses]);

  useEffect(() => {
    if (!autoRanSession && hookStatuses.length > 0) {
      setAutoRanSession(true);
      // session-start otomatik tetiklenir
      const sessionHook = hookStatuses.find(
        (h) => h.name === "session-start.js" && h.exists
      );
      if (sessionHook) {
        runHook("session-start.js", "session_start");
      }
      // security-guard otomatik tetiklenir
      const securityHook = hookStatuses.find(
        (h) => h.name === "security-guard.js" && h.exists
      );
      if (securityHook) {
        runHook("security-guard.js", "auto_check");
      }
    }
  }, [hookStatuses, autoRanSession, runHook]);

  const getHookIcon = (name: string) => {
    if (name.includes("security")) return <Lock size={18} className="text-[var(--danger)]" />;
    if (name.includes("session-start")) return <Clock size={18} className="text-[var(--success)]" />;
    if (name.includes("skill")) return <AlertTriangle size={18} className="text-[var(--warning)]" />;
    return <FileCode2 size={18} className="text-[var(--accent)]" />;
  };

  const getStatusIcon = (hookName: string) => {
    const result = runResults[hookName];
    if (!result || result.status === "idle") return null;
    if (result.status === "running") return <Loader2 size={16} className="animate-spin text-[var(--accent)]" />;
    if (result.status === "success") return <CheckCircle size={16} className="text-[var(--success)]" />;
    if (result.status === "error") return <XCircle size={16} className="text-[var(--danger)]" />;
    if (result.status === "not_found") return <XCircle size={16} className="text-[var(--warning)]" />;
    return null;
  };

  const getHookExists = (name: string) => {
    const status = hookStatuses.find((h) => h.name === name);
    return status?.exists ?? false;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hooklar & Kurallar</h1>
          <p className="text-[var(--text-secondary)]">
            Otomatik tetikleyiciler ve global kisitlamalar - Hooklar sayfa yuklendiginde otomatik calisir
          </p>
        </div>
        <button
          onClick={() => {
            hooks.forEach((h) => {
              if (getHookExists(h.name)) {
                runHook(h.name, "manual_all");
              }
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
        >
          <RefreshCw size={14} />
          Tumunu Calistir
        </button>
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
          {hooks.map((hook) => {
            const result = runResults[hook.name];
            const exists = getHookExists(hook.name);

            return (
              <div
                key={hook.name}
                className={clsx(
                  "bg-[var(--bg-card)] rounded-xl border p-5 transition-all",
                  result?.status === "success"
                    ? "border-[var(--success)]"
                    : result?.status === "error"
                      ? "border-[var(--danger)]"
                      : result?.status === "running"
                        ? "border-[var(--accent)] pulse-glow"
                        : "border-[var(--border)]"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                      {getHookIcon(hook.name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                          {hook.name}
                        </h3>
                        {getStatusIcon(hook.name)}
                        {exists ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(34,197,94,0.1)] text-[var(--success)]">
                            YUKLU
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(239,68,68,0.1)] text-[var(--danger)]">
                            BULUNAMADI
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] mt-1 mb-2">
                        {hook.trigger}
                      </span>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {hook.description}
                      </p>

                      {/* Output */}
                      {result && result.status !== "idle" && result.status !== "running" && (
                        <div className="mt-3 p-3 bg-[#0d1117] rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                              {result.timestamp
                                ? new Date(result.timestamp).toLocaleTimeString("tr-TR")
                                : ""}
                            </span>
                            <span
                              className={clsx(
                                "text-[10px] font-medium",
                                result.status === "success"
                                  ? "text-[var(--success)]"
                                  : "text-[var(--danger)]"
                              )}
                            >
                              {result.status === "success" ? "BASARILI" : result.status === "not_found" ? "DOSYA YOK" : "HATA"}
                            </span>
                          </div>
                          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {result.output || result.error || ""}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => runHook(hook.name, hook.trigger)}
                    disabled={result?.status === "running" || !exists}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0",
                      result?.status === "running"
                        ? "bg-[var(--accent-light)] text-[var(--accent)]"
                        : exists
                          ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                          : "bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-not-allowed"
                    )}
                  >
                    {result?.status === "running" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Play size={12} />
                    )}
                    {result?.status === "running" ? "Calisiyor..." : "Calistir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-[var(--warning)]" />
          Kurallar
          <span className="text-sm text-[var(--text-muted)] font-normal">
            (4 global kisitlama - her zaman aktif)
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {rule.name}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(34,197,94,0.1)] text-[var(--success)]">
                      AKTIF
                    </span>
                  </div>
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
