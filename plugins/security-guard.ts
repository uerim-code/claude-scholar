/**
 * Security Guard Plugin
 * Hook: tool.execute.before
 */
import * as path from "path";
import * as os from "os";
import type { Plugin } from "@opencode-ai/plugin";

const BLOCK_PATTERNS = [
  /rm\s+-rf\s+\/(\s|$)/,
  /rm\s+--no-preserve-root/,
  /dd\s+if=\/dev\/(zero|random)/,
  /mkfs\./,
];

const WARN_PATTERNS = [
  /git\s+push\s+.*(-f|--force)/,
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[a-z]*f/,
  /rm\s+-[rf]/,
  /chmod\s+(-R\s+)?777/,
  /DROP\s+(DATABASE|TABLE)/i,
];

export const SecurityGuardPlugin: Plugin = async (ctx) => {
  return {
    async "tool.execute.before"(input, output) {
      const args = output.args;

      if (input.tool === "bash" && args?.command) {
        for (const p of BLOCK_PATTERNS) {
          if (p.test(args.command)) {
            console.warn(`[security-guard] BLOCKED: ${args.command}`);
            args.command = "echo 'Blocked by security guard'";
            return;
          }
        }
        for (const p of WARN_PATTERNS) {
          if (p.test(args.command)) {
            console.warn(`[security-guard] WARNING: ${args.command}`);
          }
        }
      }

      if ((input.tool === "write" || input.tool === "edit") && args?.file_path) {
        const fp = args.file_path;
        const sensitive = ["/etc/", "/usr/bin/", "/sbin/", "/System/"];
        for (const sp of sensitive) {
          if (fp.startsWith(sp)) {
            console.warn(`[security-guard] BLOCKED: system path ${sp}`);
            return;
          }
        }
      }
    },
  };
};
