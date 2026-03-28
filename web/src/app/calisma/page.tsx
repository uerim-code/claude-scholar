"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Bot,
} from "lucide-react";
import { clsx } from "clsx";
import { skills, commands, agents, workflowStages } from "@/lib/data";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; size: number }[];
  skill?: string;
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  content: string | null;
  type: string;
}

const quickActions = [
  { label: "Arastirma Baslat", command: "/research-init", icon: "🔬", color: "#6366f1" },
  { label: "Sonuc Analizi", command: "/analyze-results", icon: "📊", color: "#22c55e" },
  { label: "Makale Yazimi", command: "skill:ml-paper-writing", icon: "✍️", color: "#8b5cf6" },
  { label: "Rebuttal", command: "/rebuttal", icon: "💬", color: "#f59e0b" },
  { label: "Kod Inceleme", command: "/code-review", icon: "👁️", color: "#3b82f6" },
  { label: "Plan Olustur", command: "/plan", icon: "📋", color: "#ec4899" },
  { label: "Literatur Tarama", command: "/zotero-review", icon: "📚", color: "#14b8a6" },
  { label: "Sunum", command: "/presentation", icon: "🎤", color: "#f97316" },
];

export default function WorkspacePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setUploading(true);
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          setFiles((prev) => [...prev, {
            name: data.originalName,
            size: data.size,
            content: data.content,
            type: data.type,
          }]);
        }
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (text?: string, skill?: string) => {
    const msg = text || input.trim();
    if (!msg && files.length === 0) return;

    const skillToUse = skill || activeSkill;
    const userMessage: ChatMessage = {
      role: "user",
      content: msg || (files.length > 0 ? `${files.map(f => f.name).join(", ")} dosyalarini analiz et` : ""),
      files: files.map((f) => ({ name: f.name, size: f.size })),
      skill: skillToUse || undefined,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    const fileContents = files
      .filter((f) => f.content)
      .map((f) => ({ name: f.name, content: f.content! }));
    setFiles([]);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          activeSkill: skillToUse,
          fileContents: fileContents.length > 0 ? fileContents : undefined,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.error,
          timestamp: new Date(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Baglanti hatasi. Sunucuya ulasilamadi.",
        timestamp: new Date(),
      }]);
    }

    setSending(false);
  };

  const activateSkill = (command: string, label: string) => {
    setActiveSkill(command);
    setShowTools(false);
    setShowSkills(false);
    sendMessage(`${label} gorevini baslat. Bana adim adim rehberlik et.`, command);
  };

  const clearChat = () => {
    setMessages([]);
    setActiveSkill(null);
    setFiles([]);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Calisma Alani</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Tum moduller tek ekranda - dosya yukle, komut ver, sonuclari gor
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeSkill && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-light)] rounded-lg">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <span className="text-xs text-[var(--accent)] font-medium">
                {activeSkill}
              </span>
              <button onClick={() => setActiveSkill(null)} className="text-[var(--accent)] hover:text-white cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--danger)] border border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--danger)] transition-all"
          >
            <Trash2 size={12} /> Temizle
          </button>
        </div>
      </div>

      {/* Quick Actions - only show when no messages */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Bot size={48} className="text-[var(--text-muted)] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ne yapmak istersiniz?</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-md">
            Bir gorev secin veya mesaj yazin. Dosya yukleyebilir, soru sorabilir,
            arastirma baslatabilirsiniz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
            {quickActions.map((action) => (
              <button
                key={action.command}
                onClick={() => activateSkill(action.command, action.label)}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer card-hover"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium text-[var(--text-primary)]">{action.label}</span>
              </button>
            ))}
          </div>

          {/* More tools */}
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="flex items-center gap-1.5 mt-4 px-4 py-2 text-sm text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg cursor-pointer transition-all"
          >
            <Plus size={14} />
            Tum yetenekler ve komutlar
            {showSkills ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {showSkills && (
            <div className="w-full max-w-2xl mt-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 max-h-60 overflow-y-auto animate-fade-in">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Komutlar</h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {commands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => activateSkill(cmd.command, cmd.name)}
                    className="px-2.5 py-1 text-[10px] font-mono bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--accent)] hover:border-[var(--accent)] cursor-pointer transition-all"
                  >
                    {cmd.command}
                  </button>
                ))}
              </div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Yetenekler</h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => activateSkill(`skill:${s.id}`, s.name)}
                    className="px-2.5 py-1 text-[10px] bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer transition-all"
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={clsx("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={clsx(
                "max-w-[75%] rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "bg-[var(--accent)] text-white rounded-br-md"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-md"
              )}>
                {/* Attached files */}
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {msg.files.map((f, fi) => (
                      <span key={fi} className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-[10px]">
                        <FileText size={10} /> {f.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* Skill badge */}
                {msg.skill && msg.role === "user" && (
                  <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] mb-1.5 font-mono">
                    {msg.skill}
                  </span>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
                <div className={clsx(
                  "text-[10px] mt-1.5",
                  msg.role === "user" ? "text-white/50" : "text-[var(--text-muted)]"
                )}>
                  {msg.timestamp.toLocaleTimeString("tr-TR")}
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                  Dusunuyor...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Tool Drawer */}
      {messages.length > 0 && showTools && (
        <div className="shrink-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 mb-3 animate-fade-in">
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action.command}
                onClick={() => {
                  activateSkill(action.command, action.label);
                  setShowTools(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs hover:border-[var(--accent)] cursor-pointer transition-all"
              >
                <span>{action.icon}</span>
                <span className="text-[var(--text-primary)]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Preview */}
      {files.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-2 mb-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
              <FileText size={14} className="text-[var(--accent)]" />
              <span className="text-xs text-[var(--text-primary)]">{f.name}</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {(f.size / 1024).toFixed(1)}KB
              </span>
              <button onClick={() => removeFile(i)} className="text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3">
        <div className="flex items-end gap-2">
          {/* File upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.json,.txt,.md,.py,.yaml,.yml,.tex,.bib,.tsv,.log,.xml,.html"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer transition-all shrink-0"
            title="Dosya Yukle"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
          </button>

          {/* Tools toggle */}
          {messages.length > 0 && (
            <button
              onClick={() => setShowTools(!showTools)}
              className={clsx(
                "p-2.5 rounded-lg cursor-pointer transition-all shrink-0",
                showTools ? "bg-[var(--accent-light)] text-[var(--accent)]" : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent)]"
              )}
              title="Araclar"
            >
              <Sparkles size={18} />
            </button>
          )}

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              files.length > 0
                ? "Dosyalarla ne yapmami istiyorsunuz?"
                : activeSkill
                  ? "Gorev detaylarini yazin..."
                  : "Mesajinizi yazin, dosya yukleyin veya bir arac secin..."
            }
            className="flex-1 px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
            rows={1}
            disabled={sending}
          />

          {/* Send */}
          <button
            onClick={() => sendMessage()}
            disabled={sending || (!input.trim() && files.length === 0)}
            className="p-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] cursor-pointer transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
            <span>Enter gonder</span>
            <span>Shift+Enter yeni satir</span>
            <span>📎 Dosya yukle</span>
            {activeSkill && <span>✨ Aktif: {activeSkill}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
