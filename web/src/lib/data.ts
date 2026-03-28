export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface Command {
  id: string;
  command: string;
  name: string;
  description: string;
  category: string;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface WorkflowStage {
  id: number;
  name: string;
  description: string;
  tools: string[];
  commands: string[];
  color: string;
}

export const skills: Skill[] = [
  // Araştırma & Analiz
  { id: "research-ideation", name: "Araştırma Fikir Üretimi", description: "5W1H beyin fırtınası, literatür taraması, boşluk analizi, araştırma sorusu formülasyonu", category: "Araştırma & Analiz", icon: "🔬" },
  { id: "results-analysis", name: "Sonuç Analizi", description: "Katı istatistikler, bilimsel figürler, ablasyon çalışmaları", category: "Araştırma & Analiz", icon: "📊" },
  { id: "results-report", name: "Sonuç Raporu", description: "Deney sonrası özet raporlama, karar desteği", category: "Araştırma & Analiz", icon: "📋" },
  { id: "citation-verification", name: "Alıntı Doğrulama", description: "Çok katmanlı alıntı kontrolü: format→API→bilgi→içerik", category: "Araştırma & Analiz", icon: "✅" },
  { id: "daily-paper-generator", name: "Günlük Makale Üretici", description: "Araştırma takibi için günlük makale üretici", category: "Araştırma & Analiz", icon: "📰" },

  // Makale Yazımı & Yayın
  { id: "ml-paper-writing", name: "ML Makale Yazımı", description: "NeurIPS, ICML, ICLR, ACL, AAAI, COLM konferansları ve Nature, Science dergileri", category: "Makale Yazımı & Yayın", icon: "✍️" },
  { id: "writing-anti-ai", name: "AI Kalıplarını Temizle", description: "AI yazım kalıplarını kaldır, iki dilli (Çince/İngilizce)", category: "Makale Yazımı & Yayın", icon: "🧹" },
  { id: "paper-self-review", name: "Makale Öz İnceleme", description: "6 maddelik kalite kontrol listesi", category: "Makale Yazımı & Yayın", icon: "🔍" },
  { id: "review-response", name: "Hakeme Yanıt", description: "Sistematik rebuttal yazımı", category: "Makale Yazımı & Yayın", icon: "💬" },
  { id: "post-acceptance", name: "Kabul Sonrası", description: "Sunum, poster, tanıtım içeriği oluşturma", category: "Makale Yazımı & Yayın", icon: "🎉" },
  { id: "doc-coauthoring", name: "Doküman Ortak Yazım", description: "Doküman ortak yazım iş akışı", category: "Makale Yazımı & Yayın", icon: "👥" },
  { id: "latex-conference-template-organizer", name: "LaTeX Şablon Düzenleyici", description: "LaTeX konferans şablonu organizasyonu", category: "Makale Yazımı & Yayın", icon: "📐" },

  // Geliştirme İş Akışları
  { id: "daily-coding", name: "Günlük Kodlama", description: "Günlük kodlama kontrol listesi, minimal mod", category: "Geliştirme", icon: "💻" },
  { id: "git-workflow", name: "Git İş Akışı", description: "Conventional Commits, dal yönetimi standartları", category: "Geliştirme", icon: "🔀" },
  { id: "code-review-excellence", name: "Kod İnceleme", description: "Kod inceleme en iyi pratikleri", category: "Geliştirme", icon: "👁️" },
  { id: "bug-detective", name: "Hata Dedektifi", description: "Hata ayıklama ve araştırma (Python, Bash, JS/TS)", category: "Geliştirme", icon: "🐛" },
  { id: "architecture-design", name: "Mimari Tasarım", description: "ML proje kod mimarisi ve tasarım kalıpları", category: "Geliştirme", icon: "🏗️" },
  { id: "verification-loop", name: "Doğrulama Döngüsü", description: "Doğrulama döngüleri ve test", category: "Geliştirme", icon: "🔄" },

  // Eklenti Geliştirme
  { id: "skill-development", name: "Yetenek Geliştirme", description: "Yetenek geliştirme rehberi", category: "Eklenti Geliştirme", icon: "🔌" },
  { id: "skill-improver", name: "Yetenek İyileştirme", description: "Yetenek iyileştirme aracı", category: "Eklenti Geliştirme", icon: "⬆️" },
  { id: "skill-quality-reviewer", name: "Yetenek Kalite İnceleme", description: "Yetenek kalite değerlendirmesi", category: "Eklenti Geliştirme", icon: "⭐" },
  { id: "command-development", name: "Komut Geliştirme", description: "Slash komut geliştirme rehberi", category: "Eklenti Geliştirme", icon: "⚡" },
  { id: "plugin-structure", name: "Eklenti Yapısı", description: "Eklenti yapısı rehberi", category: "Eklenti Geliştirme", icon: "📦" },
  { id: "agent-identifier", name: "Ajan Tanımlama", description: "Ajan geliştirme yapılandırması", category: "Eklenti Geliştirme", icon: "🤖" },
  { id: "hook-development", name: "Hook Geliştirme", description: "Hook geliştirme ve olay işleme", category: "Eklenti Geliştirme", icon: "🪝" },
  { id: "mcp-integration", name: "MCP Entegrasyonu", description: "MCP sunucu entegrasyonu", category: "Eklenti Geliştirme", icon: "🔗" },

  // Araçlar & Yardımcılar
  { id: "planning-with-files", name: "Dosya ile Planlama", description: "Markdown dosyalarıyla planlama ve ilerleme takibi", category: "Araçlar", icon: "📝" },
  { id: "uv-package-manager", name: "UV Paket Yöneticisi", description: "Modern Python paket yöneticisi kullanımı", category: "Araçlar", icon: "📦" },
  { id: "webapp-testing", name: "Web Uygulama Testi", description: "Yerel web uygulama testi", category: "Araçlar", icon: "🧪" },
  { id: "kaggle-learner", name: "Kaggle Öğrenici", description: "Kaggle yarışma öğrenimi", category: "Araçlar", icon: "🏆" },

  // Obsidian
  { id: "obsidian-project-memory", name: "Proje Hafızası", description: "Obsidian proje hafızası orkestratörü", category: "Obsidian", icon: "🧠" },
  { id: "obsidian-project-bootstrap", name: "Proje Başlatma", description: "Araştırma deposunu Obsidian'a aktarma", category: "Obsidian", icon: "🚀" },
  { id: "obsidian-research-log", name: "Araştırma Günlüğü", description: "Günlük notlar, planlar, hub güncellemeleri", category: "Obsidian", icon: "📓" },
  { id: "obsidian-experiment-log", name: "Deney Günlüğü", description: "Deneyler, ablasyonlar, sonuç kaydı", category: "Obsidian", icon: "🔬" },
  { id: "obsidian-link-graph", name: "Bağlantı Grafiği", description: "Wikilink onarımı", category: "Obsidian", icon: "🕸️" },
  { id: "obsidian-synthesis-map", name: "Sentez Haritası", description: "Üst düzey sentez notları ve karşılaştırma özetleri", category: "Obsidian", icon: "🗺️" },
  { id: "obsidian-project-lifecycle", name: "Proje Yaşam Döngüsü", description: "Ayırma, arşivleme, temizleme işlemleri", category: "Obsidian", icon: "♻️" },
  { id: "zotero-obsidian-bridge", name: "Zotero-Obsidian Köprüsü", description: "Zotero koleksiyonlarını Obsidian'a aktarma", category: "Obsidian", icon: "🌉" },
  { id: "obsidian-literature-workflow", name: "Literatür İş Akışı", description: "Makale notu normalizasyonu ve literatür taraması", category: "Obsidian", icon: "📚" },

  // Web Tasarım
  { id: "frontend-design", name: "Frontend Tasarım", description: "Üretim kalitesinde frontend arayüzleri", category: "Web Tasarım", icon: "🎨" },
  { id: "ui-ux-pro-max", name: "UI/UX Pro Max", description: "50+ stil, 97 palet, 57 font eşleşmesi, 9 stack", category: "Web Tasarım", icon: "✨" },
  { id: "web-design-reviewer", name: "Web Tasarım İnceleme", description: "Görsel web sitesi incelemesi", category: "Web Tasarım", icon: "🖥️" },
];

export const commands: Command[] = [
  // Araştırma
  { id: "research-init", command: "/research-init", name: "Araştırma Başlat", description: "Zotero entegreli araştırma fikir üretimi başlat", category: "Araştırma" },
  { id: "zotero-review", command: "/zotero-review", name: "Zotero İnceleme", description: "Zotero koleksiyonundan makaleleri oku ve sentezle", category: "Araştırma" },
  { id: "zotero-notes", command: "/zotero-notes", name: "Zotero Notları", description: "Toplu makale okuma ve detaylı not oluşturma", category: "Araştırma" },
  { id: "obsidian-init", command: "/obsidian-init", name: "Obsidian Başlat", description: "Obsidian proje bilgi tabanını başlat", category: "Araştırma" },
  { id: "obsidian-ingest", command: "/obsidian-ingest", name: "Obsidian İçe Aktar", description: "Yeni Markdown dosyası veya dizin içe aktar", category: "Araştırma" },
  { id: "obsidian-review", command: "/obsidian-review", name: "Obsidian İnceleme", description: "Proje bağlantılı literatür sentezi oluştur", category: "Araştırma" },
  { id: "obsidian-notes", command: "/obsidian-notes", name: "Obsidian Notları", description: "Makale notlarını normalize et ve bağla", category: "Araştırma" },
  { id: "obsidian-sync", command: "/obsidian-sync", name: "Obsidian Senkronizasyon", description: "Repo ve Obsidian arasında zorla senkronizasyon", category: "Araştırma" },
  { id: "obsidian-link", command: "/obsidian-link", name: "Obsidian Bağlantı", description: "Proje wikilink'lerini onar veya güçlendir", category: "Araştırma" },
  { id: "obsidian-note", command: "/obsidian-note", name: "Obsidian Not", description: "Tekil notu arşivle, temizle veya yeniden adlandır", category: "Araştırma" },
  { id: "obsidian-project", command: "/obsidian-project", name: "Obsidian Proje", description: "Proje bilgi tabanını yönet", category: "Araştırma" },
  { id: "obsidian-views", command: "/obsidian-views", name: "Obsidian Görünümler", description: "Opsiyonel .base görünümleri ve canvas'lar oluştur", category: "Araştırma" },
  { id: "analyze-results", command: "/analyze-results", name: "Sonuçları Analiz Et", description: "İstatistiksel testler, görselleştirme, ablasyon analizi", category: "Araştırma" },
  { id: "rebuttal", command: "/rebuttal", name: "Rebuttal Oluştur", description: "Sistematik rebuttal dokümanı oluştur", category: "Araştırma" },
  { id: "presentation", command: "/presentation", name: "Sunum Oluştur", description: "Konferans sunum taslağı oluştur", category: "Araştırma" },
  { id: "poster", command: "/poster", name: "Poster Tasarla", description: "Akademik poster tasarımı", category: "Araştırma" },
  { id: "promote", command: "/promote", name: "Tanıtım İçeriği", description: "Twitter, LinkedIn, blog tanıtım içeriği", category: "Araştırma" },

  // Geliştirme
  { id: "plan", command: "/plan", name: "Plan Oluştur", description: "Uygulama planı oluştur", category: "Geliştirme" },
  { id: "commit", command: "/commit", name: "Commit", description: "Conventional Commits ile kod gönder", category: "Geliştirme" },
  { id: "update-github", command: "/update-github", name: "GitHub Güncelle", description: "Commit ve push işlemi", category: "Geliştirme" },
  { id: "update-readme", command: "/update-readme", name: "README Güncelle", description: "README dokümantasyonunu güncelle", category: "Geliştirme" },
  { id: "code-review", command: "/code-review", name: "Kod İnceleme", description: "Kod incelemesi yap", category: "Geliştirme" },
  { id: "tdd", command: "/tdd", name: "TDD", description: "Test odaklı geliştirme iş akışı", category: "Geliştirme" },
  { id: "build-fix", command: "/build-fix", name: "Build Düzelt", description: "Build hatalarını düzelt", category: "Geliştirme" },
  { id: "verify", command: "/verify", name: "Doğrula", description: "Değişiklikleri doğrula", category: "Geliştirme" },
  { id: "checkpoint", command: "/checkpoint", name: "Kontrol Noktası", description: "Kontrol noktası oluştur", category: "Geliştirme" },
  { id: "refactor-clean", command: "/refactor-clean", name: "Refaktör Temizle", description: "Refaktör ve temizlik", category: "Geliştirme" },
  { id: "learn", command: "/learn", name: "Öğren", description: "Koddan tekrar kullanılabilir kalıpları çıkar", category: "Geliştirme" },
  { id: "create-project", command: "/create_project", name: "Proje Oluştur", description: "Yeni proje oluştur", category: "Geliştirme" },
  { id: "setup-pm", command: "/setup-pm", name: "Paket Yöneticisi Kur", description: "Paket yöneticisini yapılandır (uv/pnpm)", category: "Geliştirme" },
  { id: "update-memory", command: "/update-memory", name: "Hafıza Güncelle", description: "CLAUDE.md hafızasını kontrol et ve güncelle", category: "Geliştirme" },

  // SuperClaude
  { id: "sc-agent", command: "/sc agent", name: "SC: Ajan Gönder", description: "Ajan gönderi", category: "SuperClaude" },
  { id: "sc-analyze", command: "/sc analyze", name: "SC: Analiz", description: "Kod analizi", category: "SuperClaude" },
  { id: "sc-brainstorm", command: "/sc brainstorm", name: "SC: Beyin Fırtınası", description: "İnteraktif beyin fırtınası", category: "SuperClaude" },
  { id: "sc-build", command: "/sc build", name: "SC: Derle", description: "Projeyi derle", category: "SuperClaude" },
  { id: "sc-cleanup", command: "/sc cleanup", name: "SC: Temizlik", description: "Kod temizliği", category: "SuperClaude" },
  { id: "sc-design", command: "/sc design", name: "SC: Tasarım", description: "Sistem tasarımı", category: "SuperClaude" },
  { id: "sc-document", command: "/sc document", name: "SC: Dokümantasyon", description: "Dokümantasyon oluştur", category: "SuperClaude" },
  { id: "sc-estimate", command: "/sc estimate", name: "SC: Tahmin", description: "Efor tahmini", category: "SuperClaude" },
  { id: "sc-explain", command: "/sc explain", name: "SC: Açıkla", description: "Kod açıklaması", category: "SuperClaude" },
  { id: "sc-git", command: "/sc git", name: "SC: Git", description: "Git işlemleri", category: "SuperClaude" },
  { id: "sc-implement", command: "/sc implement", name: "SC: Uygula", description: "Özellik uygulaması", category: "SuperClaude" },
  { id: "sc-improve", command: "/sc improve", name: "SC: İyileştir", description: "Kod iyileştirme", category: "SuperClaude" },
  { id: "sc-index", command: "/sc index", name: "SC: İndeks", description: "Proje indeksi", category: "SuperClaude" },
  { id: "sc-research", command: "/sc research", name: "SC: Araştırma", description: "Teknik araştırma", category: "SuperClaude" },
  { id: "sc-test", command: "/sc test", name: "SC: Test", description: "Test çalıştırma", category: "SuperClaude" },
  { id: "sc-troubleshoot", command: "/sc troubleshoot", name: "SC: Sorun Giderme", description: "Sorun giderme", category: "SuperClaude" },
  { id: "sc-workflow", command: "/sc workflow", name: "SC: İş Akışı", description: "İş akışı yönetimi", category: "SuperClaude" },
];

export const agents: Agent[] = [
  { id: "literature-reviewer", name: "literature-reviewer", title: "Literatür Tarayıcı", description: "Literatür arama, sınıflandırma ve trend analizi. Zotero MCP entegrasyonu ile otomatik içe aktarma ve tam metin okuma.", category: "Araştırma", icon: "📚" },
  { id: "literature-reviewer-obsidian", name: "literature-reviewer-obsidian", title: "Obsidian Literatür Tarayıcı", description: "Obsidian proje bilgi tabanından dosya sistemi tabanlı literatür taraması.", category: "Araştırma", icon: "📖" },
  { id: "research-knowledge-curator-obsidian", name: "research-knowledge-curator-obsidian", title: "Araştırma Bilgi Küratörü", description: "Obsidian'da proje planları, günlük kayıtlar, literatür, deneyler, sonuçlar ve yazım küratörlüğü.", category: "Araştırma", icon: "🧠" },
  { id: "rebuttal-writer", name: "rebuttal-writer", title: "Rebuttal Yazıcı", description: "Sistematik rebuttal yazımı, ton optimizasyonu ile hakeme yanıt.", category: "Araştırma", icon: "✍️" },
  { id: "paper-miner", name: "paper-miner", title: "Makale Madencisi", description: "Başarılı makalelerden yazım bilgisi çıkarma.", category: "Araştırma", icon: "⛏️" },
  { id: "architect", name: "architect", title: "Mimar", description: "Sistem mimarisi tasarımı ve planlama.", category: "Geliştirme", icon: "🏛️" },
  { id: "build-error-resolver", name: "build-error-resolver", title: "Build Hata Çözücü", description: "Build hatalarını tespit etme ve düzeltme.", category: "Geliştirme", icon: "🔧" },
  { id: "bug-analyzer", name: "bug-analyzer", title: "Hata Analizcisi", description: "Derin kod yürütme akışı analizi ve kök neden araştırması.", category: "Geliştirme", icon: "🐛" },
  { id: "code-reviewer", name: "code-reviewer", title: "Kod İnceleyici", description: "Kapsamlı kod inceleme ve kalite değerlendirmesi.", category: "Geliştirme", icon: "👁️" },
  { id: "dev-planner", name: "dev-planner", title: "Geliştirme Planlayıcı", description: "Geliştirme görevi planlama ve iş bölümü.", category: "Geliştirme", icon: "📋" },
  { id: "refactor-cleaner", name: "refactor-cleaner", title: "Refaktör Temizleyici", description: "Kod refaktörü ve temizlik operasyonları.", category: "Geliştirme", icon: "🧹" },
  { id: "tdd-guide", name: "tdd-guide", title: "TDD Rehberi", description: "Test odaklı geliştirme iş akışı rehberliği.", category: "Geliştirme", icon: "🧪" },
  { id: "kaggle-miner", name: "kaggle-miner", title: "Kaggle Madencisi", description: "Kaggle çözümlerinden mühendislik pratikleri çıkarma.", category: "Geliştirme", icon: "🏆" },
  { id: "ui-sketcher", name: "ui-sketcher", title: "UI Çizici", description: "UI taslaklarını ve etkileşim spesifikasyonlarını tasarlama.", category: "Tasarım", icon: "🎨" },
  { id: "story-generator", name: "story-generator", title: "Hikaye Üretici", description: "Kullanıcı hikayesi ve gereksinim üretimi.", category: "Tasarım", icon: "📝" },
];

export const workflowStages: WorkflowStage[] = [
  { id: 1, name: "Fikir Üretimi", description: "Araştırma konusu belirleme, literatür tarama, boşluk analizi", tools: ["research-ideation", "literature-reviewer"], commands: ["/research-init", "/zotero-review"], color: "#6366f1" },
  { id: 2, name: "ML Geliştirme", description: "Kod mimarisi, geliştirme, kod inceleme", tools: ["architecture-design", "code-reviewer"], commands: ["/plan", "/commit", "/tdd"], color: "#8b5cf6" },
  { id: 3, name: "Deney Analizi", description: "İstatistiksel testler, görselleştirme, ablasyon", tools: ["results-analysis", "results-report"], commands: ["/analyze-results"], color: "#a78bfa" },
  { id: 4, name: "Makale Yazımı", description: "Makale taslağı, yazım kalıpları, şablon düzenleme", tools: ["ml-paper-writing", "paper-miner"], commands: ["/mine-writing-patterns"], color: "#c084fc" },
  { id: 5, name: "Öz İnceleme", description: "6 maddelik kalite kontrol, tutarlılık kontrolü", tools: ["paper-self-review"], commands: [], color: "#e879f9" },
  { id: 6, name: "Gönderim & Rebuttal", description: "Hakeme sistematik yanıt, ton optimizasyonu", tools: ["review-response", "rebuttal-writer"], commands: ["/rebuttal"], color: "#f472b6" },
  { id: 7, name: "Kabul Sonrası", description: "Sunum, poster, tanıtım içeriği", tools: ["post-acceptance"], commands: ["/presentation", "/poster", "/promote"], color: "#fb7185" },
];

export const skillCategories = [
  { name: "Araştırma & Analiz", color: "#6366f1", count: 5 },
  { name: "Makale Yazımı & Yayın", color: "#8b5cf6", count: 7 },
  { name: "Geliştirme", color: "#22c55e", count: 6 },
  { name: "Eklenti Geliştirme", color: "#f59e0b", count: 8 },
  { name: "Araçlar", color: "#3b82f6", count: 4 },
  { name: "Obsidian", color: "#a78bfa", count: 9 },
  { name: "Web Tasarım", color: "#f472b6", count: 3 },
];

export const hooks = [
  { name: "session-start.js", trigger: "Oturum Başlangıcı", description: "Git durumu, yapılacaklar, komutlar ve Obsidian bağlantı durumunu göster" },
  { name: "skill-forced-eval.js", trigger: "Her Kullanıcı Girdisi", description: "Tüm mevcut yetenekleri değerlendir ve Obsidian küratör akışını tetikle" },
  { name: "session-summary.js", trigger: "Oturum Sonu", description: "Çalışma günlüğü oluştur, CLAUDE.md güncellemelerini algıla" },
  { name: "stop-summary.js", trigger: "Oturum Durdurma", description: "Hızlı durum kontrolü, geçici dosya tespiti" },
  { name: "security-guard.js", trigger: "Dosya İşlemleri", description: "Güvenlik doğrulama, anahtar tespiti, tehlikeli komut engelleme" },
];

export const rules = [
  { name: "Kodlama Stili", file: "coding-style.md", description: "ML proje standartları: 200-400 satır dosyalar, değişmez yapılandırma, tip ipuçları, Factory & Registry kalıpları" },
  { name: "Ajan Kuralları", file: "agents.md", description: "Ajan orkestrasyonu: otomatik tetikleme zamanlaması, paralel çalıştırma, çoklu perspektif analizi" },
  { name: "Güvenlik", file: "security.md", description: "Anahtar yönetimi, hassas dosya koruması, pre-commit güvenlik kontrolleri" },
  { name: "Deney Tekrarlanabilirliği", file: "experiment-reproducibility.md", description: "Rastgele tohumlar, yapılandırma kaydı, ortam kaydı, kontrol noktası yönetimi" },
];
