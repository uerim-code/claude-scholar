import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "@/lib/prompt-builder";
import { readFileSync, existsSync } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), ".config.json");

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, activeSkill, fileContents } = await request.json() as {
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

    // Build system prompt with active skill context
    let systemPrompt: string;
    if (activeSkill) {
      const ctx = buildPrompt(activeSkill);
      systemPrompt = ctx.systemPrompt;
    } else {
      const ctx = buildPrompt("/research-init");
      systemPrompt = ctx.systemPrompt.split("--- KOMUT TANIMI ---")[0];
    }

    systemPrompt += `\n\nHer zaman Turkce yanit ver. Kullaniciya yardimci ol.
Adim adim rehberlik yap. Kullanicinin bir sonraki adimda ne yapmasini gerektigini acikla.
Dosya iceriklerini analiz edebilirsin.`;

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
