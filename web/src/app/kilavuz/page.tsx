"use client";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Rocket,
  Settings,
  Terminal,
  Sparkles,
  Bot,
  GitBranch,
  Shield,
  Webhook,
  Database,
  Zap,
  FileText,
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: "genel-bakis", title: "Genel Bakis", icon: <BookOpen size={16} /> },
  { id: "kurulum", title: "Kurulum", icon: <Rocket size={16} /> },
  { id: "kontrol-paneli", title: "Kontrol Paneli", icon: <Layers size={16} /> },
  { id: "yetenekler", title: "Yetenekler (Skills)", icon: <Sparkles size={16} /> },
  { id: "komutlar", title: "Komutlar", icon: <Terminal size={16} /> },
  { id: "ajanlar", title: "Ajanlar", icon: <Bot size={16} /> },
  { id: "arastirma-akisi", title: "Arastirma Akisi", icon: <GitBranch size={16} /> },
  { id: "hooklar", title: "Hooklar", icon: <Webhook size={16} /> },
  { id: "kurallar", title: "Kurallar", icon: <Shield size={16} /> },
  { id: "terminal", title: "Terminal", icon: <Zap size={16} /> },
  { id: "zotero", title: "Zotero Entegrasyonu", icon: <FileText size={16} /> },
  { id: "obsidian", title: "Obsidian Entegrasyonu", icon: <Database size={16} /> },
  { id: "ayarlar", title: "Ayarlar", icon: <Settings size={16} /> },
  { id: "sss", title: "Sikca Sorulan Sorular", icon: <Info size={16} /> },
];

function InfoBox({ type, children }: { type: "info" | "warning" | "success"; children: React.ReactNode }) {
  const styles = {
    info: "bg-[rgba(99,102,241,0.1)] border-[var(--accent)] text-[var(--accent)]",
    warning: "bg-[rgba(245,158,11,0.1)] border-[var(--warning)] text-[var(--warning)]",
    success: "bg-[rgba(34,197,94,0.1)] border-[var(--success)] text-[var(--success)]",
  };
  const icons = {
    info: <Info size={16} />,
    warning: <AlertCircle size={16} />,
    success: <CheckCircle size={16} />,
  };
  return (
    <div className={clsx("flex gap-3 p-4 rounded-lg border-l-4 mb-4", styles[type])}>
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="text-sm text-[var(--text-primary)]">{children}</div>
    </div>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="bg-[#0d1117] rounded-lg border border-[var(--border)] mb-4 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-[#161b22] border-b border-[var(--border)] text-xs text-[var(--text-muted)] font-mono">
          {title}
        </div>
      )}
      <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

function FAQ({ question, children }: { question: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--border)] rounded-lg mb-2 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all"
      >
        <span className="text-sm font-medium text-[var(--text-primary)]">{question}</span>
        {open ? <ChevronDown size={16} className="text-[var(--text-muted)]" /> : <ChevronRight size={16} className="text-[var(--text-muted)]" />}
      </button>
      {open && (
        <div className="px-4 py-3 text-sm text-[var(--text-secondary)] bg-[var(--bg-primary)] border-t border-[var(--border)] animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState("genel-bakis");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = sections.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kullanma Kilavuzu</h1>
        <p className="text-[var(--text-secondary)]">
          Claude Scholar Web Arayuzu - Detayli kullanim rehberi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-3">
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Bolum ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <nav className="space-y-0.5">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={clsx(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left",
                    activeSection === section.id
                      ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 min-h-[80vh]">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-8">

            {/* GENEL BAKIS */}
            {activeSection === "genel-bakis" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Genel Bakis</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  <strong>Claude Scholar</strong>, akademik arastirma ve yazilim gelistirme sureclerini yoneten
                  yari otomatik bir arastirma asistanidir. Bu web arayuzu, Claude Scholar&apos;in tum
                  ozelliklerini gorsel ve kullanici dostu bir sekilde sunmaktadir.
                </p>

                <h3 className="text-lg font-semibold mt-6">Ne Yapar?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: "🔬", title: "Literatur Tarama", desc: "Zotero ile otomatik makale arama, siniflandirma ve trend analizi" },
                    { icon: "💻", title: "ML Gelistirme", desc: "Kod mimarisi tasarimi, TDD, kod inceleme ve refaktor" },
                    { icon: "📊", title: "Deney Analizi", desc: "Istatistiksel testler, bilimsel figurler, ablasyon calismalari" },
                    { icon: "✍️", title: "Makale Yazimi", desc: "NeurIPS, ICML, ICLR, Nature, Science formatlarina uygun yazim" },
                    { icon: "💬", title: "Rebuttal", desc: "Sistematik hakem yaniti olusturma, ton optimizasyonu" },
                    { icon: "🎉", title: "Kabul Sonrasi", desc: "Sunum, poster ve sosyal medya tanitim icerigi" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-6">Sistem Bileşenleri</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Bilesen</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Sayi</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Aciklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-medium">Yetenekler</td><td className="py-2 px-3">42+</td><td className="py-2 px-3 text-[var(--text-secondary)]">Arastirma, yazim, gelistirme ve daha fazlasi</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-medium">Komutlar</td><td className="py-2 px-3">47+</td><td className="py-2 px-3 text-[var(--text-secondary)]">Tek tikla calistirilabilen is akislari</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-medium">Ajanlar</td><td className="py-2 px-3">15</td><td className="py-2 px-3 text-[var(--text-secondary)]">Uzman gorev yoneticileri</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-medium">Hooklar</td><td className="py-2 px-3">5</td><td className="py-2 px-3 text-[var(--text-secondary)]">Otomatik tetikleyiciler</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Kurallar</td><td className="py-2 px-3">4</td><td className="py-2 px-3 text-[var(--text-secondary)]">Global kisitlamalar</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mt-6">Hedef Kullanicilar</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--success)]" /> Bilgisayar Bilimleri PhD ogrencileri ve arastirmacilari</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--success)]" /> AI/ML arastirmacilari</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--success)]" /> Arastirma muhendisleri</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--success)]" /> Yazilim odakli akademik projeler</li>
                </ul>

                <InfoBox type="info">
                  Bu proje <a href="https://github.com/Galaxy-Dawn/claude-scholar" target="_blank" rel="noopener noreferrer" className="underline">Galaxy-Dawn/claude-scholar</a> acik kaynak projesinin fork&apos;udur. MIT Lisansi ile dagitilmaktadir.
                </InfoBox>
              </div>
            )}

            {/* KURULUM */}
            {activeSection === "kurulum" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Kurulum</h2>

                <h3 className="text-lg font-semibold">Gereksinimler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Node.js", desc: "v18+, hook betikleri icin gerekli", required: true },
                    { name: "Git", desc: "Versiyon kontrolu icin gerekli", required: true },
                    { name: "Claude Code CLI", desc: "Komutlari calistirmak icin gerekli", required: true },
                    { name: "Python + uv", desc: "Python gelistirme is akislari icin", required: false },
                    { name: "Zotero Desktop", desc: "Literatur yonetimi icin", required: false },
                    { name: "Obsidian", desc: "Bilgi tabani icin", required: false },
                  ].map((req) => (
                    <div key={req.name} className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                      {req.required ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(239,68,68,0.1)] text-[var(--danger)] font-medium">ZORUNLU</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(59,130,246,0.1)] text-[var(--info)] font-medium">OPSIYONEL</span>
                      )}
                      <div>
                        <div className="text-sm font-medium">{req.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{req.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-6">1. Projeyi Klonlayin</h3>
                <CodeBlock title="Terminal">{`git clone https://github.com/uerim-code/claude-scholar.git
cd claude-scholar`}</CodeBlock>

                <h3 className="text-lg font-semibold">2. Claude Scholar&apos;i Kurun</h3>
                <CodeBlock title="Terminal">{`# Tam kurulum (onerilen)
bash scripts/setup.sh

# Bu komut:
# - skills, commands, agents, rules, hooks dosyalarini ~/.claude/ dizinine kopyalar
# - settings.json yapilandirmasini gunceller
# - Mevcut dosyalari yedekler`}</CodeBlock>

                <h3 className="text-lg font-semibold">3. Web Arayuzunu Baslatin</h3>
                <CodeBlock title="Terminal">{`cd web
npm install
npm run dev

# Tarayicinizda http://localhost:3000 adresini acin`}</CodeBlock>

                <InfoBox type="success">
                  Kurulum tamamlandi! Artik web arayuzunden tum Claude Scholar ozelliklerini kullanabilirsiniz.
                </InfoBox>
              </div>
            )}

            {/* KONTROL PANELI */}
            {activeSection === "kontrol-paneli" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Kontrol Paneli</h2>
                <p className="text-[var(--text-secondary)]">
                  Kontrol paneli, sistemin genel durumunu gormek ve hizli eylemlere erismek icin ana sayfadir.
                </p>

                <h3 className="text-lg font-semibold">Bolumler</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Istatistik Kartlari</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Yetenek, komut, ajan ve kural sayilarini gosteren tiklanabilir kartlar. Her kart ilgili sayfaya yonlendirir.</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Arastirma Akisi</h4>
                    <p className="text-xs text-[var(--text-secondary)]">7 asamali arastirma yasam dongusunun mini gorunumu. &quot;Detayli Gorunum&quot; ile tam pipeline&apos;a erisebilirsiniz.</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Hizli Eylemler</h4>
                    <p className="text-xs text-[var(--text-secondary)]">En cok kullanilan komutlara tek tikla erisim. Her buton ilgili Claude Code komutunu calistirir.</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Arastirma Araclari</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Literatur tarama, Obsidian, makale yazimi ve sunum araclarina dogru link kartlari.</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Kaynak Referanslari</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Projenin kaynak dosyalarinin yapisi ve orijinal projeye atif.</p>
                  </div>
                </div>
              </div>
            )}

            {/* YETENEKLER */}
            {activeSection === "yetenekler" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Yetenekler (Skills)</h2>
                <p className="text-[var(--text-secondary)]">
                  Yetenekler, Claude Scholar&apos;in cekirdek yetkinlikleridir. Her yetenek belirli bir gorev icin
                  optimize edilmis rehberlik ve sablonlar icerir.
                </p>

                <h3 className="text-lg font-semibold">Kategoriler</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Kategori</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Sayi</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Kullanim Alani</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Arastirma & Analiz</td><td className="py-2 px-3">5</td><td className="py-2 px-3 text-[var(--text-secondary)]">Literatur tarama, sonuc analizi, alinit dogrulama</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Makale Yazimi & Yayin</td><td className="py-2 px-3">7</td><td className="py-2 px-3 text-[var(--text-secondary)]">ML makale yazimi, AI kaliplarini temizleme, rebuttal</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Gelistirme</td><td className="py-2 px-3">6</td><td className="py-2 px-3 text-[var(--text-secondary)]">Kod inceleme, hata ayiklama, mimari tasarim</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Eklenti Gelistirme</td><td className="py-2 px-3">8</td><td className="py-2 px-3 text-[var(--text-secondary)]">Yetenek, komut, hook ve ajan gelistirme</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Araclar</td><td className="py-2 px-3">4</td><td className="py-2 px-3 text-[var(--text-secondary)]">Planlama, paket yonetimi, test</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3">Obsidian</td><td className="py-2 px-3">9+</td><td className="py-2 px-3 text-[var(--text-secondary)]">Proje hafizasi, deney gunlugu, literatur is akisi</td></tr>
                      <tr><td className="py-2 px-3">Web Tasarim</td><td className="py-2 px-3">3</td><td className="py-2 px-3 text-[var(--text-secondary)]">Frontend tasarim, UI/UX, web inceleme</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mt-6">Nasil Kullanilir?</h3>
                <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span><span><Link href="/yetenekler" className="text-[var(--accent)]">Yetenekler sayfasina</Link> gidin</span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span><span>Kategori filtresi veya arama ile istediginiz yetenegi bulun</span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span><span>Yetenek kartindaki <strong>Calistir</strong> butonuna basin</span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span><span>Yetenek Claude Code uzerinden calistirilir ve sonuc gosterilir</span></li>
                </ol>

                <InfoBox type="info">
                  Her yetenegin kaynak kodu <code className="text-[var(--accent)]">skills/yetenek-adi/SKILL.md</code> dosyasinda tanimlidir.
                  Icerisinde rehber, sablon ve ornek ciktilar bulunur.
                </InfoBox>
              </div>
            )}

            {/* KOMUTLAR */}
            {activeSection === "komutlar" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Komutlar</h2>
                <p className="text-[var(--text-secondary)]">
                  Komutlar, is akislarini tek tikla baslatmanizi saglar. Her komut bir veya birden fazla
                  yetenek ve ajani birlikte calistirir.
                </p>

                <h3 className="text-lg font-semibold">Komut Kategorileri</h3>

                <h4 className="text-base font-semibold text-[var(--accent)]">Arastirma Komutlari</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Komut</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Islem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/research-init</td><td className="py-2 px-3 text-[var(--text-secondary)]">Zotero entegreli arastirma fikir uretimi baslatir</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/zotero-review</td><td className="py-2 px-3 text-[var(--text-secondary)]">Zotero koleksiyonundan makaleleri okur ve sentezler</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/analyze-results</td><td className="py-2 px-3 text-[var(--text-secondary)]">Deney sonuclarini analiz eder (istatistik, gorsellestime)</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/rebuttal</td><td className="py-2 px-3 text-[var(--text-secondary)]">Sistematik rebuttal dokumani olusturur</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/presentation</td><td className="py-2 px-3 text-[var(--text-secondary)]">Konferans sunum taslagi olusturur</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-[var(--accent)]">/poster</td><td className="py-2 px-3 text-[var(--text-secondary)]">Akademik poster tasarimi yapar</td></tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-base font-semibold text-[#22c55e]">Gelistirme Komutlari</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Komut</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Islem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/plan</td><td className="py-2 px-3 text-[var(--text-secondary)]">Uygulama plani olusturur</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/commit</td><td className="py-2 px-3 text-[var(--text-secondary)]">Conventional Commits ile kod gonderir</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/code-review</td><td className="py-2 px-3 text-[var(--text-secondary)]">Kod incelemesi yapar</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/tdd</td><td className="py-2 px-3 text-[var(--text-secondary)]">Test odakli gelistirme baslatir</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-[var(--accent)]">/build-fix</td><td className="py-2 px-3 text-[var(--text-secondary)]">Build hatalarini otomatik duzeltir</td></tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-base font-semibold text-[#f59e0b]">SuperClaude Komutlari (/sc)</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  <code className="text-[var(--accent)]">/sc</code> on eki ile 20+ alt komut. Analiz, beyin firtinasi,
                  derleme, tasarim, dokumantasyon, test ve daha fazlasi.
                </p>
                <CodeBlock>{`/sc analyze    # Kod analizi
/sc brainstorm # Beyin firtinasi
/sc build      # Projeyi derle
/sc test       # Testleri calistir
/sc implement  # Ozellik uygula
/sc explain    # Kodu acikla`}</CodeBlock>

                <h3 className="text-lg font-semibold mt-6">Nasil Calistirilir?</h3>
                <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>1. <Link href="/komutlar" className="text-[var(--accent)]">Komutlar sayfasindan</Link> istediginiz komutu bulun</li>
                  <li>2. <strong>Calistir</strong> butonuna basin veya <strong>Kopyala</strong> ile terminale yapisturin</li>
                  <li>3. Sonuc sayfanin ustunde goruntulenir</li>
                  <li>4. Alternatif olarak <Link href="/terminal" className="text-[var(--accent)]">Terminal sayfasindan</Link> komutu elle yazabilirsiniz</li>
                </ol>
              </div>
            )}

            {/* AJANLAR */}
            {activeSection === "ajanlar" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Ajanlar</h2>
                <p className="text-[var(--text-secondary)]">
                  Ajanlar, belirli gorevler icin uzmanlasmis yapay zeka asistandir. Her ajan kendi
                  bilgi tabani ve yetkinlik alanina sahiptir.
                </p>

                <h3 className="text-lg font-semibold">Ajan Kategorileri</h3>

                <h4 className="text-base font-semibold">Arastirma Ajanlari (5)</h4>
                <div className="space-y-2 mb-4">
                  {[
                    { name: "literature-reviewer", desc: "Literatur arama, siniflandirma, trend analizi. Zotero MCP ile tam metin okuma." },
                    { name: "literature-reviewer-obsidian", desc: "Obsidian vault'undan dosya tabanli literatur taramasi." },
                    { name: "research-knowledge-curator-obsidian", desc: "Proje planlari, gunluk kayitlar, deneyler, sonuclar kuratorlugu." },
                    { name: "rebuttal-writer", desc: "Sistematik hakem yaniti, ton optimizasyonu." },
                    { name: "paper-miner", desc: "Basarili makalelerden yazim kaliplari ve bilgi cikarma." },
                  ].map((a) => (
                    <div key={a.name} className="p-3 bg-[var(--bg-primary)] rounded-lg">
                      <code className="text-xs text-[var(--accent)]">{a.name}</code>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{a.desc}</p>
                    </div>
                  ))}
                </div>

                <h4 className="text-base font-semibold">Gelistirme Ajanlari (8)</h4>
                <div className="space-y-2 mb-4">
                  {[
                    { name: "architect", desc: "Sistem mimarisi tasarimi ve planlama." },
                    { name: "code-reviewer", desc: "Kapsamli kod inceleme ve kalite degerlendirmesi." },
                    { name: "bug-analyzer", desc: "Derin kod analizi ve kok neden arastirmasi." },
                    { name: "dev-planner", desc: "Gelistirme gorevi planlama ve is bolumu." },
                    { name: "tdd-guide", desc: "Test odakli gelistirme rehberligi." },
                    { name: "build-error-resolver", desc: "Build hatalarini tespit etme ve duzeltme." },
                    { name: "refactor-cleaner", desc: "Kod refaktoru ve temizlik." },
                    { name: "kaggle-miner", desc: "Kaggle cozumlerinden muhendislik pratikleri cikarma." },
                  ].map((a) => (
                    <div key={a.name} className="p-3 bg-[var(--bg-primary)] rounded-lg">
                      <code className="text-xs text-[var(--accent)]">{a.name}</code>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{a.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-6">Ajan Kullanimi</h3>
                <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>1. <Link href="/ajanlar" className="text-[var(--accent)]">Ajanlar sayfasina</Link> gidin</li>
                  <li>2. Istediginiz ajanin <strong>Baslat</strong> butonuna basin</li>
                  <li>3. Sag tarafta acilan sohbet panelinde mesajinizi yazin</li>
                  <li>4. Ajan Claude Code uzerinden gorevi islemeye baslar</li>
                </ol>

                <InfoBox type="warning">
                  Ajanlar Claude Code CLI uzerinden calisir. CLI&apos;in kurulu ve yapilandirilmis olmasi gerekir.
                </InfoBox>
              </div>
            )}

            {/* ARASTIRMA AKISI */}
            {activeSection === "arastirma-akisi" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Arastirma Akisi</h2>
                <p className="text-[var(--text-secondary)]">
                  Claude Scholar, akademik arastirma surecini 7 asamaya boler. Her asama kendi arac ve komutlarina sahiptir.
                </p>

                <div className="space-y-4">
                  {[
                    { num: 1, name: "Fikir Uretimi", color: "#6366f1", desc: "Arastirma konusu belirleme, 5W1H beyin firtinasi, literatur on taramasi, bosluk analizi, arastirma sorusu formulasyonu.", tools: "/research-init, /zotero-review", skills: "research-ideation" },
                    { num: 2, name: "ML Gelistirme", color: "#8b5cf6", desc: "Kod mimarisi tasarimi, uygulama, TDD, kod inceleme, refaktor.", tools: "/plan, /commit, /tdd, /code-review", skills: "architecture-design, daily-coding" },
                    { num: 3, name: "Deney Analizi", color: "#a78bfa", desc: "Istatistiksel testler (t-test, ANOVA), bilimsel figurler, ablasyon calismalari, sonuc raporlama.", tools: "/analyze-results", skills: "results-analysis, results-report" },
                    { num: 4, name: "Makale Yazimi", color: "#c084fc", desc: "Konferans/dergi formatinda taslak, yazim kaliplari, sablon duzenleme.", tools: "/mine-writing-patterns", skills: "ml-paper-writing, paper-miner" },
                    { num: 5, name: "Oz Inceleme", color: "#e879f9", desc: "6 maddelik kalite kontrol listesi: tutarlilik, yenilik, deneysel kanit, yazim kalitesi, referanslar, etik.", tools: "Manuel", skills: "paper-self-review" },
                    { num: 6, name: "Gonderim & Rebuttal", color: "#f472b6", desc: "Hakeme sistematik yanit, ton optimizasyonu, ek deney planlama.", tools: "/rebuttal", skills: "review-response" },
                    { num: 7, name: "Kabul Sonrasi", color: "#fb7185", desc: "Konferans sunumu, poster tasarimi, sosyal medya tanitimi (Twitter, LinkedIn, blog).", tools: "/presentation, /poster, /promote", skills: "post-acceptance" },
                  ].map((stage) => (
                    <div key={stage.num} className="p-4 bg-[var(--bg-primary)] rounded-lg border-l-4" style={{ borderColor: stage.color }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: stage.color }}>
                          {stage.num}
                        </div>
                        <h4 className="text-sm font-semibold">{stage.name}</h4>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">{stage.desc}</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)]">Komutlar: {stage.tools}</span>
                        <span className="px-2 py-0.5 rounded bg-[rgba(34,197,94,0.1)] text-[var(--success)]">Yetenekler: {stage.skills}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox type="info">
                  <Link href="/arastirma" className="text-[var(--accent)]">Arastirma Akisi sayfasinda</Link> her asamayi tiklanabilir kartlarla gorebilir, ilerlemenizi takip edebilir ve komutlari dogrudan calistirabilirsiniz.
                </InfoBox>
              </div>
            )}

            {/* HOOKLAR */}
            {activeSection === "hooklar" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Hooklar</h2>
                <p className="text-[var(--text-secondary)]">
                  Hooklar, belirli olaylarda otomatik calisan Node.js betikleridir. Web arayuzunde sayfa yuklendiginde
                  ilgili hooklar otomatik tetiklenir.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Hook</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Tetikleyici</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Islem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">session-start.js</td><td className="py-2 px-3">Sayfa Yukleme</td><td className="py-2 px-3 text-[var(--text-secondary)]">Git durumu, yapilaciaklar, Obsidian baglanti durumu</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">skill-forced-eval.js</td><td className="py-2 px-3">Her Kullanici Girdisi</td><td className="py-2 px-3 text-[var(--text-secondary)]">Tum yetenekleri degerlendir, Obsidian kurator akisini tetikle</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">session-summary.js</td><td className="py-2 px-3">Oturum Sonu</td><td className="py-2 px-3 text-[var(--text-secondary)]">Calisma gunlugu olustur, CLAUDE.md guncellemelerini algila</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">stop-summary.js</td><td className="py-2 px-3">Oturum Durdurma</td><td className="py-2 px-3 text-[var(--text-secondary)]">Hizli durum kontrolu, gecici dosya tespiti</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-[var(--accent)]">security-guard.js</td><td className="py-2 px-3">Dosya Islemleri</td><td className="py-2 px-3 text-[var(--text-secondary)]">Guvenlik dogrulama, anahtar tespiti, tehlikeli komut engelleme</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mt-6">Otomatik Tetikleme</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Web arayuzunde <Link href="/hooklar" className="text-[var(--accent)]">Hooklar sayfasi</Link> acildiginda:
                </p>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>- <code className="text-[var(--accent)]">session-start.js</code> otomatik calisir</li>
                  <li>- <code className="text-[var(--accent)]">security-guard.js</code> otomatik calisir</li>
                  <li>- Diger hooklar &quot;Calistir&quot; butonu veya &quot;Tumunu Calistir&quot; ile tetiklenebilir</li>
                  <li>- Her hookin ciktisi kart icerisinde gercek zamanli gosterilir</li>
                </ul>

                <InfoBox type="info">
                  Hook dosyalari <code className="text-[var(--accent)]">hooks/*.js</code> dizininde bulunur. Kurulum sirasinda <code className="text-[var(--accent)]">~/.claude/hooks/</code> dizinine kopyalanir.
                </InfoBox>
              </div>
            )}

            {/* KURALLAR */}
            {activeSection === "kurallar" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Kurallar</h2>
                <p className="text-[var(--text-secondary)]">
                  Kurallar, tum calisma boyunca aktif olan global kisitlamalardir. Devre disi birakilamaz.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border-l-4 border-[var(--warning)]">
                    <h4 className="text-sm font-semibold mb-1">Kodlama Stili (coding-style.md)</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- Dosya basina 200-400 satir siniri</li>
                      <li>- Degismez (immutable) yapilandirma</li>
                      <li>- Tip ipuclari (type hints) zorunlu</li>
                      <li>- Factory ve Registry tasarim kaliplari</li>
                      <li>- PEP 8 uyumu, Ingilizce yorumlar</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border-l-4 border-[var(--accent)]">
                    <h4 className="text-sm font-semibold mb-1">Ajan Kurallari (agents.md)</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- Otomatik tetikleme zamanlama kurallari</li>
                      <li>- Paralel calistirma politikasi</li>
                      <li>- Coklu perspektif analizi gereksinimleri</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border-l-4 border-[var(--danger)]">
                    <h4 className="text-sm font-semibold mb-1">Guvenlik (security.md)</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- API anahtari ve sifrler icin anahtar yonetimi</li>
                      <li>- Hassas dosya korumasi (.env, credentials)</li>
                      <li>- Pre-commit guvenlik kontrolleri</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border-l-4 border-[var(--success)]">
                    <h4 className="text-sm font-semibold mb-1">Deney Tekrarlanabilirligi (experiment-reproducibility.md)</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- Rastgele tohum (seed) kaydi zorunlu</li>
                      <li>- Yapilandirma dosyalariinin kaydi</li>
                      <li>- Ortam bilgisi loglama</li>
                      <li>- Kontrol noktasi (checkpoint) yonetimi</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TERMINAL */}
            {activeSection === "terminal" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Terminal</h2>
                <p className="text-[var(--text-secondary)]">
                  Terminal sayfasi, Claude Scholar komutlarini dogrudan yazip calistirmanizi saglar.
                </p>

                <h3 className="text-lg font-semibold">Kullanim</h3>
                <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>1. <Link href="/terminal" className="text-[var(--accent)]">Terminal sayfasina</Link> gidin</li>
                  <li>2. Alt kisidmaki girdi alanina komutunuzu yazin (ornek: <code className="text-[var(--accent)]">/research-init</code>)</li>
                  <li>3. Enter tusu veya gonder butonuna basin</li>
                  <li>4. Cikti terminal penceresinde yesil renkte gosterilir</li>
                  <li>5. Hatalar kirmizi renkte gosterilir</li>
                </ol>

                <h3 className="text-lg font-semibold mt-4">Hizli Komut Kutucuklari</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Terminal sayfasinin altinda en cok kullanilan komutlar icin hizli erisim kutucuklari bulunur.
                  Bir kutucuga tikladiginizda komut girdi alanina yazilir.
                </p>

                <InfoBox type="warning">
                  Guvenlik icin sadece <code className="text-[var(--accent)]">/</code> ile baslayan Claude Scholar komutlari calistiriilabilir.
                  Genel kabuk (shell) komutlari engellenmistir.
                </InfoBox>
              </div>
            )}

            {/* ZOTERO */}
            {activeSection === "zotero" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Zotero Entegrasyonu</h2>
                <p className="text-[var(--text-secondary)]">
                  Zotero MCP sunucusu ile makale yonetimi ve literatur taramasi yapabilirsiniz.
                </p>

                <h3 className="text-lg font-semibold">Kurulum Adimlari</h3>
                <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span><span>Zotero Desktop uygulamasini kurun</span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span><span>Zotero MCP paketini yukleyin: <code className="text-[var(--accent)]">uv tool install zotero-mcp</code></span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span><span>Zotero Web API anahtari olusturun (yazma islemleri icin)</span></li>
                  <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span><span><Link href="/ayarlar" className="text-[var(--accent)]">Ayarlar sayfasindan</Link> API anahtari ve kullanici ID&apos;nizi girin</span></li>
                </ol>

                <h3 className="text-lg font-semibold mt-4">Ozellikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { title: "Otomatik Ickeri Aktarma", desc: "DOI, arXiv ID veya URL ile makale ekleme" },
                    { title: "Tam Metin Okuma", desc: "PDF icerigi Zotero MCP uzerinden okunur" },
                    { title: "Koleksiyon Yonetimi", desc: "Arastirma konusuna gore otomatik gruplama" },
                    { title: "Alinit Aktarimi", desc: "BibTeX, APA, MLA formatlarinda cikarma" },
                  ].map((f) => (
                    <div key={f.title} className="p-3 bg-[var(--bg-primary)] rounded-lg">
                      <div className="text-sm font-medium mb-1">{f.title}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OBSIDIAN */}
            {activeSection === "obsidian" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Obsidian Entegrasyonu</h2>
                <p className="text-[var(--text-secondary)]">
                  Obsidian, dosya sistemi tabanli proje bilgi tabani olarak kullanilir. API veya MCP gerektirmez.
                </p>

                <h3 className="text-lg font-semibold">Vault Yapisi</h3>
                <CodeBlock title="Obsidian Vault">{`Research/
├── {proje-adi}/
│   ├── 00-Hub.md           # Proje ana sayfasi
│   ├── Plans/              # Arastirma planlari
│   ├── Daily/              # Gunluk notlar
│   ├── Literature/         # Makale notlari
│   ├── Experiments/        # Deney kayitlari
│   ├── Results/            # Sonuc raporlari
│   ├── Writing/            # Taslaklar ve yazilar
│   ├── Archive/            # Arsivlenmis notlar
│   └── Maps/               # Canvas ve haritalar
│       └── literature.canvas`}</CodeBlock>

                <h3 className="text-lg font-semibold">Ilgili Komutlar</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Komut</th>
                        <th className="text-left py-2 px-3 text-[var(--text-muted)]">Islem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/obsidian-init</td><td className="py-2 px-3 text-[var(--text-secondary)]">Proje bilgi tabanini baslat</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/obsidian-ingest</td><td className="py-2 px-3 text-[var(--text-secondary)]">Yeni dosya veya dizin ice aktar</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/obsidian-sync</td><td className="py-2 px-3 text-[var(--text-secondary)]">Repo ve Obsidian arasinda senkronizasyon</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="py-2 px-3 font-mono text-[var(--accent)]">/obsidian-review</td><td className="py-2 px-3 text-[var(--text-secondary)]">Literatur sentezi olustur</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-[var(--accent)]">/obsidian-project</td><td className="py-2 px-3 text-[var(--text-secondary)]">Proje bilgi tabanini yonet</td></tr>
                    </tbody>
                  </table>
                </div>

                <InfoBox type="success">
                  Obsidian entegrasyonu API gerektirmez. Vault dizinini <Link href="/ayarlar" className="text-[var(--accent)]">Ayarlar sayfasindan</Link> yapilandirmaniz yeterlidir.
                </InfoBox>
              </div>
            )}

            {/* AYARLAR */}
            {activeSection === "ayarlar" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Ayarlar</h2>
                <p className="text-[var(--text-secondary)]">
                  <Link href="/ayarlar" className="text-[var(--accent)]">Ayarlar sayfasindan</Link> tum yapilandirma seceneklerine erisebilirsiniz.
                </p>

                <h3 className="text-lg font-semibold">Bolumler</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Genel Ayarlar</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- Arayuz dili (Turkce/English)</li>
                      <li>- Hedef konferanslar (NeurIPS, ICML, ICLR, KDD...)</li>
                      <li>- Commit stili (Conventional Commits)</li>
                      <li>- Paket yoneticisi (uv, pip, pnpm, npm)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Zotero Ayarlari</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- API anahtari</li>
                      <li>- Kullanici ID</li>
                      <li>- MCP sunucu modu (salt okunur / okuma-yazma)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">Obsidian Ayarlari</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- Vault dizin yolu</li>
                      <li>- Not dili</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h4 className="text-sm font-semibold mb-1">GitHub Ayarlari</h4>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                      <li>- GitHub token</li>
                      <li>- Dal stratejisi</li>
                      <li>- Merge stratejisi</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SSS */}
            {activeSection === "sss" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Sikca Sorulan Sorular</h2>

                <FAQ question="Claude Scholar nedir?">
                  Claude Scholar, akademik arastirma ve yazilim gelistirme sureclerini yoneten yari otomatik bir asistan sistemidir.
                  Claude Code CLI uzerinde calisir ve bu web arayuzu tum ozelliklerini gorsel olarak sunar.
                </FAQ>

                <FAQ question="Bu web arayuzu olmadan da kullanabilir miyim?">
                  Evet. Claude Scholar temelde bir CLI aracidir. Tum komutlari (<code className="text-[var(--accent)]">/research-init</code>, <code className="text-[var(--accent)]">/analyze-results</code> vb.)
                  dogrudan Claude Code CLI&apos;da yazarak kullanabilirsiniz. Web arayuzu gorsel bir kolaylik katmani saglar.
                </FAQ>

                <FAQ question="Zotero ve Obsidian zorunlu mu?">
                  Hayir. Her ikisi de opsiyoneldir. Zotero literatur yonetimi, Obsidian ise bilgi tabani icin onerilen araclardir.
                  Bunlar olmadan da temel arastirma ve gelistirme is akislarini kullanabilirsiniz.
                </FAQ>

                <FAQ question="Komutlari web arayuzunden calitirmak guvenli mi?">
                  Evet. Backend API&apos;si sadece <code className="text-[var(--accent)]">/</code> ile baslayan Claude Scholar komutlarini kabul eder.
                  Genel kabuk komutlari (rm, sudo vb.) engellenmistir.
                </FAQ>

                <FAQ question="Yeni bir yetenek veya komut nasil eklerim?">
                  Eklenti gelistirme yeteneklerini kullanabilirsiniz:
                  <br />- <code className="text-[var(--accent)]">skill-development</code>: Yeni yetenek olusturma rehberi
                  <br />- <code className="text-[var(--accent)]">command-development</code>: Yeni komut olusturma rehberi
                  <br />- <code className="text-[var(--accent)]">hook-development</code>: Yeni hook olusturma rehberi
                </FAQ>

                <FAQ question="Hangi konferans formatlarini destekliyor?">
                  NeurIPS, ICML, ICLR, KDD, ACL, AAAI, COLM konferanslari ve Nature, Science, Cell, PNAS dergileri icin
                  hazir sablonlar ve yazim rehberleri icerir.
                </FAQ>

                <FAQ question="Hooklar ne zaman calisir?">
                  CLI modunda hooklar otomatik tetiklenir (oturum baslangici, kullanici girdisi, oturum sonu vb.).
                  Web arayuzunde ise Hooklar sayfasina girildiginde <code className="text-[var(--accent)]">session-start.js</code> ve
                  <code className="text-[var(--accent)]"> security-guard.js</code> otomatik calisir. Diger hooklar &quot;Calistir&quot; butonu ile tetiklenebilir.
                </FAQ>

                <FAQ question="Orijinal proje nerede?">
                  Bu proje <a href="https://github.com/Galaxy-Dawn/claude-scholar" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">Galaxy-Dawn/claude-scholar</a> acik kaynak projesinin fork&apos;udur. MIT Lisansi ile dagitilmaktadir.
                </FAQ>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
