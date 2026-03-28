import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "@/lib/prompt-builder";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), ".config.json");

function getApiKey(): string | null {
  // 1. Environment variable
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;

  // 2. Config file
  if (existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
      if (config.apiKey) return config.apiKey;
    } catch {
      // ignore
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { command, input } = await request.json();

    if (!command) {
      return NextResponse.json({ error: "Komut belirtilmedi" }, { status: 400 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json({
        error: "API anahtari yapilandirilmamis. Ayarlar sayfasindan Anthropic API anahtarinizi girin.",
        needsConfig: true,
      }, { status: 401 });
    }

    const client = new Anthropic({ apiKey });
    const promptCtx = buildPrompt(command, input);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: promptCtx.systemPrompt,
      messages: [
        { role: "user", content: promptCtx.userPrompt },
      ],
    });

    const textContent = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({
      output: textContent,
      command,
      sourceFile: promptCtx.sourceFile,
      type: promptCtx.type,
      model: message.model,
      usage: message.usage,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };

    if (err.status === 401) {
      return NextResponse.json({
        error: "API anahtari gecersiz. Ayarlar sayfasindan dogru anahtari girin.",
        needsConfig: true,
      }, { status: 401 });
    }

    return NextResponse.json({
      error: err.message || "Komut calistirilirken hata olustu",
    }, { status: 500 });
  }
}
