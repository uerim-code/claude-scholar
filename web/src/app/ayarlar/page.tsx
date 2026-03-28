"use client";
import { useState } from "react";
import {
  Settings,
  BookOpen,
  Database,
  Globe,
  Save,
  CheckCircle,
  FolderOpen,
  Key,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: SettingSection[] = [
  { id: "genel", title: "Genel Ayarlar", icon: <Settings size={18} /> },
  {
    id: "zotero",
    title: "Zotero Entegrasyonu",
    icon: <BookOpen size={18} />,
  },
  {
    id: "obsidian",
    title: "Obsidian Entegrasyonu",
    icon: <Database size={18} />,
  },
  { id: "github", title: "GitHub Ayarları", icon: <Globe size={18} /> },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("genel");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
          <p className="text-[var(--text-secondary)]">
            Claude Scholar yapılandırma ve entegrasyon ayarları
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

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
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          {activeSection === "genel" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Genel Ayarlar</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dil
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Turkce</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hedef Konferanslar
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "NeurIPS",
                      "ICML",
                      "ICLR",
                      "KDD",
                      "ACL",
                      "AAAI",
                      "COLM",
                    ].map((conf) => (
                      <label
                        key={conf}
                        className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm cursor-pointer hover:border-[var(--accent)]"
                      >
                        <input type="checkbox" defaultChecked className="accent-[var(--accent)]" />
                        {conf}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commit Stili
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Conventional Commits</option>
                    <option>Serbest Format</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paket Yoneticisi
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>uv</option>
                    <option>pip</option>
                    <option>pnpm</option>
                    <option>npm</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "zotero" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Zotero Entegrasyonu</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Zotero MCP sunucusu ile makale yonetimi icin yapilandirma
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Key size={14} className="inline mr-1" />
                    Zotero API Anahtari
                  </label>
                  <input
                    type="password"
                    placeholder="Zotero API anahtarinizi girin..."
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zotero Kullanici ID
                  </label>
                  <input
                    type="text"
                    placeholder="Zotero kullanici ID'nizi girin..."
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    MCP Sunucu Modu
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Salt Okunur (Yerel)</option>
                    <option>Okuma/Yazma (Web API)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "obsidian" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">
                Obsidian Entegrasyonu
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Obsidian bilgi tabani yapilandirmasi - API gerektirmez
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FolderOpen size={14} className="inline mr-1" />
                    Vault Dizini
                  </label>
                  <input
                    type="text"
                    placeholder="/Users/username/ObsidianVault"
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Not Dili
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Turkce</option>
                    <option>English</option>
                    <option>Chinese</option>
                  </select>
                </div>

                <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                  <h4 className="text-sm font-medium mb-2">Vault Yapisi</h4>
                  <pre className="text-xs text-[var(--text-muted)] font-mono">
{`Research/
├── {proje-adi}/
│   ├── 00-Hub.md
│   ├── Plans/
│   ├── Daily/
│   ├── Literature/
│   ├── Experiments/
│   ├── Results/
│   ├── Writing/
│   └── Archive/`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeSection === "github" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">GitHub Ayarlari</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Key size={14} className="inline mr-1" />
                    GitHub Token
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_..."
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dal Stratejisi
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>
                      master/develop/feature/bugfix/hotfix/release
                    </option>
                    <option>main/feature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Merge Stratejisi
                  </label>
                  <select className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                    <option>Rebase (feature sync) + Merge --no-ff (integration)</option>
                    <option>Squash and Merge</option>
                    <option>Merge Commit</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
