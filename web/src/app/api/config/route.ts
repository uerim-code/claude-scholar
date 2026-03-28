import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), ".config.json");

function readConfig(): Record<string, string> {
  if (existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function writeConfig(config: Record<string, string>) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function GET() {
  const config = readConfig();
  // Mask API key for security
  const masked = { ...config };
  if (masked.apiKey) {
    masked.apiKey = masked.apiKey.substring(0, 10) + "..." + masked.apiKey.slice(-4);
  }
  return NextResponse.json({
    config: masked,
    configured: !!config.apiKey,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = readConfig();

    if (body.apiKey !== undefined) config.apiKey = body.apiKey;
    if (body.language !== undefined) config.language = body.language;
    if (body.vaultPath !== undefined) config.vaultPath = body.vaultPath;
    if (body.zoteroKey !== undefined) config.zoteroKey = body.zoteroKey;
    if (body.zoteroUserId !== undefined) config.zoteroUserId = body.zoteroUserId;
    if (body.githubToken !== undefined) config.githubToken = body.githubToken;

    writeConfig(config);

    return NextResponse.json({ success: true, message: "Ayarlar kaydedildi." });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}
