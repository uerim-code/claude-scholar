"use client";
import { useCommandRunner } from "@/lib/command-runner";
import { Play, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface RunButtonProps {
  command: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
}

export default function RunButton({
  command,
  label,
  variant = "primary",
  size = "sm",
  className,
  children,
}: RunButtonProps) {
  const { runCommand, isRunning, currentCommand } = useCommandRunner();
  const isThisRunning = isRunning && currentCommand === command;

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

  return (
    <button
      onClick={() => runCommand(command, label)}
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
