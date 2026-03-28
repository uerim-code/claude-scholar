import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), ".config.json");
const PROJECT_ROOT = path.resolve(process.cwd(), "..");

function getApiKey(): string | null {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  if (existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
      if (config.apiKey) return config.apiKey;
    } catch { /* ignore */ }
  }
  return null;
}

function loadAllSkillSummaries(): string {
  const skillsDir = path.join(PROJECT_ROOT, "skills");
  if (!existsSync(skillsDir)) return "";
  const summaries: string[] = [];
  for (const dir of readdirSync(skillsDir)) {
    const skillFile = path.join(skillsDir, dir, "SKILL.md");
    if (existsSync(skillFile)) {
      const content = readFileSync(skillFile, "utf-8");
      // First 500 chars as summary
      summaries.push(`### ${dir}\n${content.substring(0, 500)}\n`);
    }
  }
  return summaries.join("\n");
}

function loadAllAgentSummaries(): string {
  const agentsDir = path.join(PROJECT_ROOT, "agents");
  if (!existsSync(agentsDir)) return "";
  const summaries: string[] = [];
  for (const file of readdirSync(agentsDir).filter(f => f.endsWith(".md"))) {
    const content = readFileSync(path.join(agentsDir, file), "utf-8");
    summaries.push(`### ${file.replace(".md", "")}\n${content.substring(0, 400)}\n`);
  }
  return summaries.join("\n");
}

function loadClaudeMd(): string {
  const claudeMdPath = path.join(PROJECT_ROOT, "CLAUDE.md");
  if (existsSync(claudeMdPath)) {
    return readFileSync(claudeMdPath, "utf-8").substring(0, 4000);
  }
  return "";
}

function loadCommandSummaries(): string {
  const cmdsDir = path.join(PROJECT_ROOT, "commands");
  if (!existsSync(cmdsDir)) return "";
  const summaries: string[] = [];
  for (const file of readdirSync(cmdsDir).filter(f => f.endsWith(".md"))) {
    const content = readFileSync(path.join(cmdsDir, file), "utf-8");
    summaries.push(`### /${file.replace(".md", "")}\n${content.substring(0, 300)}\n`);
  }
  return summaries.join("\n");
}

function loadRules(): string {
  const rulesDir = path.join(PROJECT_ROOT, "rules");
  if (!existsSync(rulesDir)) return "";
  const all: string[] = [];
  for (const file of readdirSync(rulesDir).filter(f => f.endsWith(".md"))) {
    const content = readFileSync(path.join(rulesDir, file), "utf-8");
    all.push(`## ${file}\n${content.substring(0, 500)}\n`);
  }
  return all.join("\n");
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, fileContents } = await request.json() as {
      messages: ChatMessage[];
      activeSkill?: string;
      fileContents?: { name: string; content: string }[];
    };

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({
        error: "API anahtari yapilandirilmamis. Ayarlar sayfasindan girin.",
        needsConfig: true,
      }, { status: 401 });
    }

    // Build comprehensive system prompt with all knowledge
    const claudeMd = loadClaudeMd();
    const skillSummaries = loadAllSkillSummaries();
    const agentSummaries = loadAllAgentSummaries();
    const commandSummaries = loadCommandSummaries();
    const rules = loadRules();

    const systemPrompt = `Sen Claude Scholar, akademik arastirma ve yazilim gelistirme icin uzman bir asistansin.
Turkce yanit ver. Kullaniciya adim adim rehberlik et.

## Temel Bilgiler
${claudeMd}

## Kurallar (Her Zaman Aktif)
${rules}

## Mevcut Yetenekler
Kullanicinin istegine gore otomatik olarak en uygun yetenegi sec ve uygula:
${skillSummaries}

## Mevcut Ajanlar
Gerektiginde ajan rolu ustlen:
${agentSummaries}

## Mevcut Komutlar
${commandSummaries}

## Calisma Prensiplerin
1. Kullanici bir gorev verdiginde, hangi yetenek/ajan/komutun uygun oldugunu OTOMATIK belirle
2. Sectigin arac hakkinda kullaniciya kisa bilgi ver (ornek: "Literatur tarama yetenegini kullaniyorum...")
3. Adim adim rehberlik et, her adimda ne yapilacagini acikla
4. Dosya yuklendiginde icerigi analiz et ve uygun islemleri oner
5. Deney sonuclari geldiginde istatistiksel analiz yap
6. Makale yaziminda akademik standartlari uygula
7. Her zaman bir sonraki adimi oner
8. Markdown formatinda duzenli ve okunakli yanit ver

## KRITIK KURALLAR - ASLA KOD VERME
- Sen bir WEB ARAYUZU icinde calisiyorsun, kullanicinin terminali veya Python ortami YOK.
- ASLA Python, pandas, openpyxl, matplotlib veya HERHANGI bir programlama kodu VERME.
- ASLA "su kodu calistirin", "su scripti kullanin", "pip install" gibi talimatlar VERME.
- ASLA kod blogu icinde calistirilabilir kod gosterme. Sadece SONUCLARI goster.
- Kullanici dosya yuklediginde, dosyanin icerigi mesajin icerisinde sana ZATEN verilmistir.
- Dosya icerigi "--- YUKLENEN DOSYALAR ---" bolumunde yer alir.
- Excel dosyalari CSV formatina donusturulmus olarak sana verilir.
- Sen zaten veriyi goruyorsun, DOGRUDAN analiz et, ozetle, yorumla.
- Tablolari Markdown tablo formatinda goster.
- Istatistiksel ozet, trend analizi, anomali tespiti gibi analizleri KENDIN yap.
- Makale yazarken DOGRUDAN makale metnini yaz, makale olusturmak icin kod YAZMA.
- Kullanici yaniti Word olarak indirebilir, sen sadece ICERIK uret.
- Yanit formatini her zaman Markdown olarak ver (basliklar, tablolar, listeler).`;

    // Inject file contents into last user message
    const processedMessages = [...messages];
    if (fileContents && fileContents.length > 0 && processedMessages.length > 0) {
      const lastIdx = processedMessages.length - 1;
      if (processedMessages[lastIdx].role === "user") {
        let fileSection = "\n\n--- YUKLENEN DOSYALAR ---\n";
        for (const f of fileContents) {
          fileSection += `\n### Dosya: ${f.name}\n\`\`\`\n${f.content.substring(0, 30000)}\n\`\`\`\n`;
        }
        processedMessages[lastIdx] = {
          ...processedMessages[lastIdx],
          content: processedMessages[lastIdx].content + fileSection,
        };
      }
    }

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: processedMessages,
    });

    const textContent = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({
      content: textContent,
      model: response.model,
      usage: response.usage,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    if (err.status === 401) {
      return NextResponse.json({ error: "API anahtari gecersiz.", needsConfig: true }, { status: 401 });
    }
    return NextResponse.json({ error: err.message || "Hata olustu" }, { status: 500 });
  }
}
