"use client";
import { useState, useEffect } from "react";
import { useCommandRunner } from "@/lib/command-runner";
import {
  Settings,
  BookOpen,
  Database,
  Globe,
  Save,
  CheckCircle,
  FolderOpen,
  Key,
  AlertTriangle,
  Loader2,
  Shield,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: SettingSection[] = [
  { id: "api", title: "API Yapilandirmasi", icon: <Key size={18} /> },
  { id: "genel", title: "Genel Ayarlar", icon: <Settings size={18} /> },
  { id: "zotero", title: "Zotero Entegrasyonu", icon: <BookOpen size={18} /> },
  { id: "obsidian", title: "Obsidian Entegrasyonu", icon: <Database size={18} /> },
  { id: "github", title: "GitHub Ayarlari", icon: <Globe size={18} /> },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("api");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [configStatus, setConfigStatus] = useState<{ configured: boolean; config: Record<string, string> } | null>(null);
  const [vaultPath, setVaultPath] = useState("");
  const [zoteroKey, setZoteroKey] = useState("");
  const [zoteroUserId, setZoteroUserId] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const { checkConfig } = useCommandRunner();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        setConfigStatus(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Re-check config
        await checkConfig();
        const configRes = await fetch("/api/config");
        const configData = await configRes.json();
        setConfigStatus(configData);
      }
    } catch {
      // error
    }
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
          <p className="text-[var(--text-secondary)]">
            Sistem yapilandirmasi - API anahtarinizi girerek baslatin
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(34,197,94,0.1)] border border-[var(--success)] rounded-lg text-sm text-[var(--success)]">
            <CheckCircle size={16} />
            Kaydedildi!
          </div>
        )}
      </div>

      {/* API Status Banner */}
      {configStatus && !configStatus.configured && (
        <div className="bg-[rgba(245,158,11,0.1)] border border-[var(--warning)] rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-[var(--warning)] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">API Anahtari Gerekli</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Sistemin calisabilmesi icin bir Anthropic API anahtari gereklidir.
              Asagidan anahtarinizi girin. Anahtar yalnizca bu bilgisayarda yerel olarak saklanir.
            </p>
          </div>
        </div>
      )}

      {configStatus?.configured && (
        <div className="bg-[rgba(34,197,94,0.1)] border border-[var(--success)] rounded-xl p-4 flex items-start gap-3">
          <Shield size={20} className="text-[var(--success)] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Sistem Hazir</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              API anahtari yapilandirildi ({configStatus.config.apiKey}). Tum komutlar ve yetenekler kullanilabilir.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all cursor-pointer text-left ${
                activeSection === section.id
                  ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {section.icon}
              {section.title}
              {section.id === "api" && !configStatus?.configured && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[var(--warning)]" />
              )}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">

          {/* API */}
          {activeSection === "api" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">API Yapilandirmasi</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Anthropic API anahtariniz tum komutlarin, yeteneklerin ve ajanlarin calismasini saglar.
                Anahtar yalnizca bu bilgisayarda yerel olarak saklanir ve hicbir yere gonderilmez.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Key size={14} className="inline mr-1" />
                  Anthropic API Anahtari
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  console.anthropic.com adresinden API anahtari olusturabilirsiniz.
                </p>
              </div>

              <button
                onClick={() => handleSave({ apiKey })}
                disabled={!apiKey || saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Kaydediliyor..." : "API Anahtarini Kaydet"}
              </button>

              <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                <h4 className="text-sm font-medium mb-2">Nasil Calisir?</h4>
                <ol className="text-xs text-[var(--text-secondary)] space-y-1.5">
                  <li>1. API anahtarinizi yukariya girin ve kaydedin</li>
                  <li>2. Herhangi bir sayfada bir dugmeye tiklayin (ornek: &quot;Arastirma Baslat&quot;)</li>
                  <li>3. Sistem ilgili skill/command dosyasini okur ve prompt olusturur</li>
                  <li>4. Claude API&apos;ye gonderir ve sonucu alt panelde gosterir</li>
                  <li>5. Tum islem otomatik - ek bir kurulum gerekmez</li>
                </ol>
              </div>
            </div>
          )}

          {/* Genel */}
          {activeSection === "genel" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Genel Ayarlar</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dil</label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Turkce</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hedef Konferanslar</label>
                  <div className="flex flex-wrap gap-2">
                    {["NeurIPS", "ICML", "ICLR", "KDD", "ACL", "AAAI", "COLM"].map((conf) => (
                      <label key={conf} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm cursor-pointer hover:border-[var(--accent)]">
                        <input type="checkbox" defaultChecked className="accent-[var(--accent)]" />
                        {conf}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zotero */}
          {activeSection === "zotero" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Zotero Entegrasyonu</h2>
              <p className="text-sm text-[var(--text-secondary)]">Opsiyonel - Literatur yonetimi icin Zotero MCP yapilandirmasi</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2"><Key size={14} className="inline mr-1" />Zotero API Anahtari</label>
                  <input type="password" value={zoteroKey} onChange={(e) => setZoteroKey(e.target.value)} placeholder="Zotero API anahtari..." className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kullanici ID</label>
                  <input type="text" value={zoteroUserId} onChange={(e) => setZoteroUserId(e.target.value)} placeholder="Zotero kullanici ID..." className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <button onClick={() => handleSave({ zoteroKey, zoteroUserId })} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] cursor-pointer disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {/* Obsidian */}
          {activeSection === "obsidian" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Obsidian Entegrasyonu</h2>
              <p className="text-sm text-[var(--text-secondary)]">Opsiyonel - Bilgi tabani icin Obsidian vault yolu</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2"><FolderOpen size={14} className="inline mr-1" />Vault Dizini</label>
                  <input type="text" value={vaultPath} onChange={(e) => setVaultPath(e.target.value)} placeholder="/Users/username/ObsidianVault" className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <button onClick={() => handleSave({ vaultPath })} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] cursor-pointer disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {/* GitHub */}
          {activeSection === "github" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">GitHub Ayarlari</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2"><Key size={14} className="inline mr-1" />GitHub Token</label>
                  <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_..." className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <button onClick={() => handleSave({ githubToken })} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] cursor-pointer disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Kaydet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
