import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import path from "path";

const execAsync = promisify(exec);

const HOOKS_DIRS = [
  path.join(process.env.HOME || "", ".claude", "hooks"),
  path.join(process.env.HOME || "", "claude-scholar", "hooks"),
];

function findHookFile(hookName: string): string | null {
  for (const dir of HOOKS_DIRS) {
    const filePath = path.join(dir, hookName);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { hook, event } = await request.json();

    if (!hook) {
      return NextResponse.json({ error: "Hook belirtilmedi" }, { status: 400 });
    }

    const hookPath = findHookFile(hook);
    if (!hookPath) {
      return NextResponse.json({
        status: "not_found",
        hook,
        message: `Hook dosyası bulunamadı: ${hook}`,
      });
    }

    const { stdout, stderr } = await execAsync(`node "${hookPath}"`, {
      timeout: 30000,
      cwd: process.env.HOME,
      env: {
        ...process.env,
        HOOK_EVENT: event || "manual",
        PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin`,
      },
    });

    return NextResponse.json({
      status: "success",
      hook,
      output: stdout || "Hook başarıyla çalıştırıldı.",
      stderr: stderr || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string; stderr?: string };
    return NextResponse.json({
      status: "error",
      error: err.stderr || err.message || "Hook çalıştırılırken hata oluştu",
      timestamp: new Date().toISOString(),
    });
  }
}

export async function GET() {
  const hookStatuses = [];
  const hookFiles = [
    "session-start.js",
    "skill-forced-eval.js",
    "session-summary.js",
    "stop-summary.js",
    "security-guard.js",
  ];

  for (const hook of hookFiles) {
    const hookPath = findHookFile(hook);
    hookStatuses.push({
      name: hook,
      exists: !!hookPath,
      path: hookPath,
    });
  }

  return NextResponse.json({ hooks: hookStatuses });
}
