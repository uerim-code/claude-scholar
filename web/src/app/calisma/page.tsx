"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Loader2,
  Trash2,
  Bot,
  Plus,
} from "lucide-react";
import { clsx } from "clsx";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; size: number }[];
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  content: string | null;
  type: string;
}

const suggestions = [
  { text: "Transformer mimarilerinde verimlilik arastirmasi baslat", icon: "🔬" },
  { text: "Bu deney sonuclarini analiz et", icon: "📊" },
  { text: "NeurIPS formatinda makale taslagi olustur", icon: "✍️" },
  { text: "Reviewer yorumlarina rebuttal hazirla", icon: "💬" },
  { text: "Proje icin uygulama plani olustur", icon: "📋" },
  { text: "Koddaki hatalari bul ve duzelt", icon: "🐛" },
];

export default function WorkspacePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

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
            name: data.originalName, size: data.size,
            content: data.content, type: data.type,
          }]);
        }
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg && files.length === 0) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: msg || `${files.map(f => f.name).join(", ")} dosyalarini analiz et`,
      files: files.map((f) => ({ name: f.name, size: f.size })),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    const fileContents = files.filter((f) => f.content).map((f) => ({ name: f.name, content: f.content! }));
    setFiles([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          fileContents: fileContents.length > 0 ? fileContents : undefined,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.content || data.error || "Yanit alinamadi.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Baglanti hatasi. Sunucuya ulasilamadi.",
        timestamp: new Date(),
      }]);
    }
    setSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-5">
            <Bot size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Claude Scholar</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 text-center max-w-md">
            Arastirma, analiz, makale yazimi, kod gelistirme - ne istersen yaz.
            Dosya yukle, soru sor. Sistem arka planda en uygun araci otomatik secer.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-xl">
            {suggestions.map((s) => (
              <button
                key={s.text}
                onClick={() => sendMessage(s.text)}
                className="flex items-start gap-2.5 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer text-left card-hover"
              >
                <span className="text-lg mt-0.5">{s.icon}</span>
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-5 pb-4 pt-2">
          {messages.map((msg, i) => (
            <div key={i} className={clsx("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={clsx(
                "rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "max-w-[70%] bg-[var(--accent)] text-white rounded-br-md"
                  : "max-w-[85%] bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-md"
              )}>
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {msg.files.map((f, fi) => (
                      <span key={fi} className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-[10px]">
                        <FileText size={10} /> {f.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className={clsx(
                  "text-sm whitespace-pre-wrap leading-relaxed",
                  msg.role === "assistant" && "prose-sm"
                )}>
                  {msg.content}
                </div>
                <div className={clsx(
                  "text-[10px] mt-2",
                  msg.role === "user" ? "text-white/40" : "text-[var(--text-muted)]"
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
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  Analiz ediliyor, uygun araclar seciliyor...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Files Preview */}
      {files.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-2 mb-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg animate-fade-in">
              <FileText size={14} className="text-[var(--accent)]" />
              <span className="text-xs text-[var(--text-primary)]">{f.name}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{(f.size / 1024).toFixed(1)}KB</span>
              <button onClick={() => removeFile(i)} className="text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"><X size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-3 mb-2">
        <div className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" multiple accept=".csv,.json,.txt,.md,.py,.yaml,.yml,.tex,.bib,.tsv,.log,.xml,.html,.pdf" className="hidden" onChange={handleFileUpload} />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2.5 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer transition-all shrink-0"
            title="Dosya Yukle"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={files.length > 0 ? "Dosyalarla ne yapmami istiyorsunuz?" : "Ne yapmak istiyorsunuz?"}
            className="flex-1 px-4 py-2.5 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none"
            rows={1}
            disabled={sending}
          />

          <button
            onClick={() => sendMessage()}
            disabled={sending || (!input.trim() && files.length === 0)}
            className="p-2.5 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-hover)] cursor-pointer transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>

      {/* Footer hint */}
      {messages.length > 0 && (
        <div className="shrink-0 flex items-center justify-center gap-4 pb-2 text-[10px] text-[var(--text-muted)]">
          <span>📎 Dosya yukle</span>
          <span>Enter gonder</span>
          <button onClick={() => { setMessages([]); setFiles([]); }} className="hover:text-[var(--accent)] cursor-pointer">
            + Yeni sohbet
          </button>
        </div>
      )}
    </div>
  );
}
