"use client";
import { useState } from "react";
import { workflowStages } from "@/lib/data";
import {
  ArrowDown,
  Play,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { clsx } from "clsx";

export default function ResearchPage() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [completedStages, setCompletedStages] = useState<Set<number>>(
    new Set()
  );

  const toggleComplete = (id: number) => {
    setCompletedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Araştırma Akışı</h1>
        <p className="text-[var(--text-secondary)]">
          7 aşamalı akademik araştırma yaşam döngüsü - Fikir üretiminden yayına
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Genel İlerleme</span>
          <span className="text-sm text-[var(--accent)]">
            {completedStages.size} / {workflowStages.length} aşama
          </span>
        </div>
        <div className="h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366f1] to-[#f472b6] rounded-full transition-all duration-500"
            style={{
              width: `${(completedStages.size / workflowStages.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Pipeline */}
      <div className="space-y-4">
        {workflowStages.map((stage, index) => {
          const isCompleted = completedStages.has(stage.id);
          const isActive = activeStage === stage.id;

          return (
            <div key={stage.id}>
              {/* Stage Card */}
              <div
                className={clsx(
                  "bg-[var(--bg-card)] rounded-xl border transition-all",
                  isCompleted
                    ? "border-[var(--success)]"
                    : isActive
                      ? "border-[var(--accent)] glow"
                      : "border-[var(--border)]"
                )}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() =>
                    setActiveStage(isActive ? null : stage.id)
                  }
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(stage.id);
                    }}
                    className="shrink-0 cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        size={24}
                        className="text-[var(--success)]"
                      />
                    ) : (
                      <Circle size={24} className="text-[var(--text-muted)]" />
                    )}
                  </button>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.id}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={clsx(
                        "text-base font-semibold",
                        isCompleted && "line-through text-[var(--text-muted)]"
                      )}
                    >
                      {stage.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {stage.description}
                    </p>
                  </div>

                  {isActive ? (
                    <ChevronUp size={18} className="text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-[var(--text-muted)]"
                    />
                  )}
                </div>

                {/* Expanded Content */}
                {isActive && (
                  <div className="px-5 pb-5 border-t border-[var(--border)] pt-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tools */}
                      <div>
                        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                          Araçlar / Yetenekler
                        </h4>
                        <div className="space-y-2">
                          {stage.tools.map((tool) => (
                            <div
                              key={tool}
                              className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-primary)] rounded-lg"
                            >
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                              <span className="text-sm font-mono">
                                {tool}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Commands */}
                      <div>
                        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                          Komutlar
                        </h4>
                        <div className="space-y-2">
                          {stage.commands.length > 0 ? (
                            stage.commands.map((cmd) => (
                              <div
                                key={cmd}
                                className="flex items-center justify-between px-3 py-2 bg-[var(--bg-primary)] rounded-lg"
                              >
                                <span className="text-sm font-mono text-[var(--accent)]">
                                  {cmd}
                                </span>
                                <button className="p-1 rounded hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--text-muted)] hover:text-[var(--accent)]">
                                  <Play size={12} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[var(--text-muted)] italic">
                              Manuel yetenek kullanımı
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Connector */}
              {index < workflowStages.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown size={18} className="text-[var(--text-muted)]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
