import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { command, input } = await request.json();

    if (!command) {
      return NextResponse.json({ error: "Komut belirtilmedi" }, { status: 400 });
    }

    // Sanitize - only allow claude scholar commands
    const isSlashCommand = command.startsWith("/");
    const isAgentCommand = command.startsWith("agent:");
    const isSCCommand = command.startsWith("/sc ");

    if (!isSlashCommand && !isAgentCommand && !isSCCommand) {
      return NextResponse.json(
        { error: "Sadece Claude Scholar komutları çalıştırılabilir (/ ile başlayan komutlar)" },
        { status: 400 }
      );
    }

    // Build the claude command
    let claudeCmd: string;
    if (isAgentCommand) {
      const agentName = command.replace("agent:", "");
      claudeCmd = `claude -p "Use the ${agentName} agent: ${input || 'start'}"`;
    } else {
      claudeCmd = `claude -p "${command}${input ? " " + input : ""}"`;
    }

    const { stdout, stderr } = await execAsync(claudeCmd, {
      timeout: 120000,
      cwd: process.env.HOME,
      env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` },
    });

    return NextResponse.json({
      output: stdout || stderr || "Komut başarıyla çalıştırıldı.",
      command,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; stderr?: string };
    return NextResponse.json(
      {
        error: err.stderr || err.message || "Komut çalıştırılırken bir hata oluştu",
        command: "unknown",
      },
      { status: 500 }
    );
  }
}
