"use client";
import Link from "next/link";
import RunButton from "@/components/RunButton";
import { useCommandRunner } from "@/lib/command-runner";
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
  Shield,
  ArrowRight,
  BookOpen,
  FlaskConical,
  FileText,
  Presentation,
  Code,
  ExternalLink,
  Activity,
  CheckCircle,
  Clock,
  Loader2,
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
      <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    </Link>
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

function RecentActivity() {
  const { logs } = useCommandRunner();
  const recent = logs.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="text-center py-6">
        <Activity size={32} className="text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--text-muted)]">
          Henuz bir islem yapilmadi
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Bir dugmeye tiklayarak baslayin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((log) => (
        <div key={log.id} className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-primary)] rounded-lg">
          {log.status === "running" ? (
            <Loader2 size={14} className="animate-spin text-[var(--accent)] shrink-0" />
          ) : log.status === "success" ? (
            <CheckCircle size={14} className="text-[var(--success)] shrink-0" />
          ) : (
            <Clock size={14} className="text-[var(--danger)] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[var(--text-primary)] truncate">{log.label}</div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">{log.command}</div>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
            {log.timestamp.toLocaleTimeString("tr-TR")}
          </span>
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
          Claude Scholar arastirma asistanina hos geldiniz
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Sparkles} label="Yetenek" value={skills.length} color="#6366f1" href="/yetenekler" />
        <StatCard icon={Terminal} label="Komut" value={commands.length} color="#22c55e" href="/komutlar" />
        <StatCard icon={Bot} label="Ajan" value={agents.length} color="#f59e0b" href="/ajanlar" />
        <StatCard icon={Shield} label="Kural & Hook" value={9} color="#ef4444" href="/hooklar" />
      </div>

      {/* Workflow Pipeline */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Arastirma Akisi</h2>
            <p className="text-sm text-[var(--text-secondary)]">7 asamali akademik arastirma yasam dongusu</p>
          </div>
          <Link href="/arastirma" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline flex items-center gap-1">
            Detayli Gorunum <ArrowRight size={14} />
          </Link>
        </div>
        <MiniPipeline />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - wider */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Hizli Eylemler</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">Dugmelere tiklayarak komutlari dogrudan calistirin. Cikti alt panelde gosterilir.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Araştırma */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Arastirma</h3>
              <div className="space-y-1.5">
                <RunButton command="/research-init" label="Arastirma Baslat" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🔬</span> Arastirma Baslat
                </RunButton>
                <RunButton command="/analyze-results" label="Sonuclari Analiz Et" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">📊</span> Sonuclari Analiz Et
                </RunButton>
                <RunButton command="/rebuttal" label="Rebuttal Olustur" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">💬</span> Rebuttal Olustur
                </RunButton>
                <RunButton command="/presentation" label="Sunum Olustur" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🎤</span> Sunum Olustur
                </RunButton>
                <RunButton command="/poster" label="Poster Tasarla" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🖼️</span> Poster Tasarla
                </RunButton>
              </div>
            </div>

            {/* Geliştirme */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Gelistirme</h3>
              <div className="space-y-1.5">
                <RunButton command="/plan" label="Plan Olustur" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">📋</span> Plan Olustur
                </RunButton>
                <RunButton command="/commit" label="Commit" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🔀</span> Commit
                </RunButton>
                <RunButton command="/code-review" label="Kod Inceleme" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">👁️</span> Kod Inceleme
                </RunButton>
                <RunButton command="/tdd" label="TDD Baslat" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🧪</span> TDD Baslat
                </RunButton>
                <RunButton command="/build-fix" label="Build Duzelt" variant="secondary" size="md" className="w-full justify-start">
                  <span className="mr-1">🔧</span> Build Duzelt
                </RunButton>
              </div>
            </div>
          </div>

          {/* Obsidian row */}
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-4 mb-2">Obsidian & Zotero</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            <RunButton command="/obsidian-init" label="Obsidian Baslat" variant="secondary" size="sm" className="w-full justify-start" />
            <RunButton command="/obsidian-sync" label="Obsidian Senkron" variant="secondary" size="sm" className="w-full justify-start" />
            <RunButton command="/zotero-review" label="Zotero Inceleme" variant="secondary" size="sm" className="w-full justify-start" />
            <RunButton command="/zotero-notes" label="Zotero Notlari" variant="secondary" size="sm" className="w-full justify-start" />
          </div>

          {/* SuperClaude row */}
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-4 mb-2">SuperClaude</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            <RunButton command="/sc analyze" label="SC Analiz" variant="ghost" size="sm" className="w-full justify-start" />
            <RunButton command="/sc brainstorm" label="SC Beyin Firtinasi" variant="ghost" size="sm" className="w-full justify-start" />
            <RunButton command="/sc test" label="SC Test" variant="ghost" size="sm" className="w-full justify-start" />
            <RunButton command="/sc implement" label="SC Uygula" variant="ghost" size="sm" className="w-full justify-start" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Son Islemler</h2>
          <RecentActivity />

          {/* Skill Categories */}
          <h3 className="text-sm font-semibold mt-6 mb-3">Yetenek Kategorileri</h3>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 text-xs text-[var(--text-primary)]">{cat.name}</div>
                <div className="text-xs font-mono text-[var(--text-muted)]">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Tools */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Arastirma Araclari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/yetenekler" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <FlaskConical size={24} className="text-[#6366f1] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Literatur Tarama</h3>
            <p className="text-xs text-[var(--text-secondary)]">Zotero ile otomatik makale arama ve siniflandirma</p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/yetenekler" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <BookOpen size={24} className="text-[#8b5cf6] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Obsidian Bilgi Tabani</h3>
            <p className="text-xs text-[var(--text-secondary)]">Dosya tabanli proje bilgi tabani ve not yonetimi</p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/yetenekler" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <FileText size={24} className="text-[#22c55e] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Makale Yazimi</h3>
            <p className="text-xs text-[var(--text-secondary)]">NeurIPS, ICML, ICLR, Nature, Science formatlari</p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Yetenekleri Gor
            </div>
          </Link>
          <Link href="/komutlar" className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 no-underline block">
            <Presentation size={24} className="text-[#f59e0b] mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Sunum & Tanitim</h3>
            <p className="text-xs text-[var(--text-secondary)]">Konferans sunumlari, posterler ve sosyal medya</p>
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--accent)]">
              <ArrowRight size={12} /> Komutlari Gor
            </div>
          </Link>
        </div>
      </div>

      {/* Attribution */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code size={18} className="text-[var(--accent)]" />
            Kaynak Referanslari
          </h2>
          <a href="https://github.com/Galaxy-Dawn/claude-scholar" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] no-underline flex items-center gap-1">
            <ExternalLink size={14} /> Orijinal Proje
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Yetenekler", code: "skills/*.md" },
            { label: "Komutlar", code: "commands/*.md" },
            { label: "Ajanlar", code: "agents/*.md" },
            { label: "Hooklar", code: "hooks/*.js" },
            { label: "Kurallar", code: "rules/*.md" },
            { label: "Yapilandirma", code: "settings.json.template" },
          ].map((ref) => (
            <div key={ref.code} className="px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
              <div className="text-[10px] text-[var(--text-muted)] mb-0.5">{ref.label}</div>
              <code className="text-xs text-[var(--accent)]">{ref.code}</code>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)]">
            Fork: <a href="https://github.com/Galaxy-Dawn/claude-scholar" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Galaxy-Dawn/claude-scholar</a> | MIT Lisansi
          </p>
        </div>
      </div>
    </div>
  );
}
