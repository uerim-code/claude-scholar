"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface CommandLog {
  id: string;
  command: string;
  label: string;
  status: "running" | "success" | "error";
  output: string;
  sourceFile?: string;
  type?: string;
  timestamp: Date;
}

interface CommandRunnerContextType {
  logs: CommandLog[];
  isRunning: boolean;
  currentCommand: string | null;
  runCommand: (command: string, label: string, input?: string) => Promise<void>;
  clearLogs: () => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  apiConfigured: boolean;
  checkConfig: () => Promise<void>;
}

const CommandRunnerContext = createContext<CommandRunnerContextType | null>(null);

export function CommandRunnerProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  const checkConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setApiConfigured(data.configured);
    } catch {
      setApiConfigured(false);
    }
  }, []);

  useEffect(() => {
    checkConfig();
  }, [checkConfig]);

  const runCommand = useCallback(async (command: string, label: string, input?: string) => {
    const id = Date.now().toString();
    setIsRunning(true);
    setCurrentCommand(command);
    setPanelOpen(true);

    const newLog: CommandLog = {
      id,
      command,
      label,
      status: "running",
      output: "",
      timestamp: new Date(),
    };

    setLogs((prev) => [newLog, ...prev]);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, input }),
      });
      const data = await res.json();

      if (data.needsConfig) {
        setApiConfigured(false);
      }

      setLogs((prev) =>
        prev.map((log) =>
          log.id === id
            ? {
                ...log,
                status: data.error ? "error" : "success",
                output: data.output || data.error || "Komut tamamlandi.",
                sourceFile: data.sourceFile,
                type: data.type,
              }
            : log
        )
      );
    } catch {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === id
            ? {
                ...log,
                status: "error",
                output: "Baglanti hatasi - Sunucuya ulasilamadi.",
              }
            : log
        )
      );
    }

    setIsRunning(false);
    setCurrentCommand(null);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <CommandRunnerContext.Provider
      value={{ logs, isRunning, currentCommand, runCommand, clearLogs, panelOpen, setPanelOpen, apiConfigured, checkConfig }}
    >
      {children}
    </CommandRunnerContext.Provider>
  );
}

export function useCommandRunner() {
  const ctx = useContext(CommandRunnerContext);
  if (!ctx) throw new Error("useCommandRunner must be used within CommandRunnerProvider");
  return ctx;
}
