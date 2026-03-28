"use client";
import { useState } from "react";
import { agents } from "@/lib/data";
import { Search, Play, MessageSquare, X } from "lucide-react";
import { clsx } from "clsx";

const categories = ["Tümü", "Araştırma", "Geliştirme", "Tasarım"];

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedAgent, setSelectedAgent] = useState<(typeof agents)[0] | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const filtered = agents.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Tümü" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartChat = (agent: (typeof agents)[0]) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: "system",
        content: `${agent.title} ajanı aktif. Size nasıl yardımcı olabilirim?`,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedAgent) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `agent:${selectedAgent.name}`,
          input: userMsg,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.output || "Yanıt alınamadı" },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Bağlantı hatası - Backend çalışıyor mu?" },
      ]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ajanlar</h1>
        <p className="text-[var(--text-secondary)]">
          {agents.length} uzman ajan - Araştırma, geliştirme ve tasarım
          görevleri için
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
            placeholder="Ajan ara..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Grid */}
        <div
          className={clsx(
            "space-y-4",
            selectedAgent ? "lg:col-span-1" : "lg:col-span-3"
          )}
        >
          <div
            className={clsx(
              "grid gap-4",
              selectedAgent
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {filtered.map((agent) => (
              <div
                key={agent.id}
                className={clsx(
                  "card-hover bg-[var(--bg-card)] rounded-xl border p-5",
                  selectedAgent?.id === agent.id
                    ? "border-[var(--accent)] glow"
                    : "border-[var(--border)]"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{agent.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {agent.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {agent.name}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {agent.description}
                </p>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--accent-light)",
                      color: "var(--accent)",
                    }}
                  >
                    {agent.category}
                  </span>
                  <button
                    onClick={() => handleStartChat(agent)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
                  >
                    <MessageSquare size={12} />
                    Başlat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        {selectedAgent && (
          <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedAgent.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold">
                    {selectedAgent.title}
                  </h3>
                  <span className="text-xs text-[var(--success)]">Aktif</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    msg.role === "user"
                      ? "ml-auto bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
