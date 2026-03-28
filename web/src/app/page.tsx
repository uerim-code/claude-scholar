import Link from "next/link";
import {
  skills,
  commands,
  agents,
  workflowStages,
  skillCategories,
} from "@/lib/data";
import {
  Sparkles,
  Terminal,
  Bot,
  GitBranch,
  Shield,
  Zap,
  ArrowRight,
  BookOpen,
  FlaskConical,
  FileText,
  Presentation,
  Code,
  ExternalLink,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;
  label: string;
  value: number;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover block bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <ArrowRight size={16} className="text-[var(--text-muted)]" />
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">
        {value}
      </div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    </Link>
  );
}

function QuickAction({
  icon,
  label,
  command,
}: {
  icon: string;
  label: string;
  command: string;
}) {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all text-left cursor-pointer">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </div>
        <div className="text-xs text-[var(--text-muted)] font-mono">
          {command}
        </div>
      </div>
      <Zap size={14} className="text-[var(--accent)]" />
    </button>
  );
}

function MiniPipeline() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {workflowStages.map((stage, i) => (
        <div key={stage.id} className="flex items-center gap-2">
          <div
            className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: `${stage.color}20`,
              color: stage.color,
              border: `1px solid ${stage.color}40`,
            }}
          >
            {stage.name}
          </div>
          {i < workflowStages.length - 1 && (
            <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Kontrol Paneli</h1>
        <p className="text-[var(--text-secondary)]">
          Claude Scholar araştırma asistanınıza hoş geldiniz
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Sparkles}
          label="Yetenek"
          value={skills.length}
          color="#6366f1"
          href="/yetenekler"
        />
        <StatCard
          icon={Terminal}
          label="Komut"
          value={commands.length}
          color="#22c55e"
          href="/komutlar"
        />
        <StatCard
          icon={Bot}
          label="Ajan"
          value={agents.length}
          color="#f59e0b"
          href="/ajanlar"
        />
        <StatCard
          icon={Shield}
          label="Kural & Hook"
          value={9}
          color="#ef4444"
          href="/hooklar"
        />
      </div>

      {/* Workflow Pipeline */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Araştırma Akışı</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              7 aşamalı akademik araştırma yaşam döngüsü
            </p>
          </div>
          <Link
            href="/arastirma"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline flex items-center gap-1"
          >
            Detaylı Görünüm <ArrowRight size={14} />
          </Link>
        </div>
        <MiniPipeline />
      </div>

      {/* Quick Actions + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Hızlı Eylemler</h2>
          <div className="space-y-2">
            <QuickAction
              icon="🔬"
              label="Yeni Araştırma Başlat"
              command="/research-init"
            />
            <QuickAction
              icon="📊"
              label="Sonuçları Analiz Et"
              command="/analyze-results"
            />
            <QuickAction
              icon="✍️"
              label="Makale Yazımı"
              command="ml-paper-writing"
            />
            <QuickAction
              icon="💬"
              label="Rebuttal Oluştur"
              command="/rebuttal"
            />
            <QuickAction
              icon="📋"
              label="Plan Oluştur"
              command="/plan"
            />
            <QuickAction
              icon="🔀"
              label="Git İşlemleri"
              command="/commit"
            />
          </div>
        </div>

        {/* Skill Categories */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Yetenek Kategorileri</h2>
          <div className="space-y-3">
            {skillCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="flex-1 text-sm text-[var(--text-primary)]">
                  {cat.name}
                </div>
                <div className="text-sm font-mono text-[var(--text-muted)]">
                  {cat.count}
                </div>
                <div className="flex-1 max-w-[120px]">
                  <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cat.count / 9) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Stages Quick Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Araştırma Araçları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/yetenekler?cat=Araştırma+%26+Analiz" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <FlaskConical size={24} className="text-[#6366f1] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Literatur Tarama</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Zotero entegrasyonu ile otomatik makale arama ve siniflandirma
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/yetenekler?cat=Obsidian" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <BookOpen size={24} className="text-[#8b5cf6] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Obsidian Bilgi Tabani</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Dosya sistemi tabanli proje bilgi tabani ve not yonetimi
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/yetenekler?cat=Makale+Yazımı+%26+Yayın" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <FileText size={24} className="text-[#22c55e] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Makale Yazimi</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              NeurIPS, ICML, ICLR, Nature, Science formatlarinda yazim
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/komutlar?cat=Araştırma" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <Presentation size={24} className="text-[#f59e0b] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Sunum & Tanitim</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Konferans sunumlari, posterler ve sosyal medya tanitimi
            </p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Komutlari Gor
            </div>
          </Link>
        </div>
      </div>

      {/* Attribution & References */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code size={18} className="text-[var(--accent)]" />
            Kaynak Referanslari
          </h2>
          <a
            href="https://github.com/Galaxy-Dawn/claude-scholar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline flex items-center gap-1"
          >
            <ExternalLink size={14} /> Orijinal Proje
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Yetenekler Dizini</div>
            <code className="text-sm text-[var(--accent)]">skills/*.md</code>
          </div>
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Komut Tanimlari</div>
            <code className="text-sm text-[var(--accent)]">commands/*.md</code>
          </div>
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Ajan Tanimlari</div>
            <code className="text-sm text-[var(--accent)]">agents/*.md</code>
          </div>
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Hook Betikleri</div>
            <code className="text-sm text-[var(--accent)]">hooks/*.js</code>
          </div>
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Kural Dosyalari</div>
            <code className="text-sm text-[var(--accent)]">rules/*.md</code>
          </div>
          <div className="px-4 py-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">Yapilandirma Sablonu</div>
            <code className="text-sm text-[var(--accent)]">settings.json.template</code>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            Bu arayuz{" "}
            <a href="https://github.com/Galaxy-Dawn/claude-scholar" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              Galaxy-Dawn/claude-scholar
            </a>{" "}
            acik kaynak projesinin fork'udur. MIT Lisansi ile dagitilmaktadir.
          </p>
          <span className="text-xs text-[var(--text-muted)] font-mono">v1.0</span>
        </div>
      </div>
    </div>
  );
}
