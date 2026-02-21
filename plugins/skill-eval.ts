/**
 * Skill Evaluation Plugin - Auto-match skills on command execute
 * Hook: command.execute.before
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { Plugin } from "@opencode-ai/plugin";

export const SkillEvalPlugin: Plugin = async (ctx) => {
  return {
    async "command.execute.before"(input, output) {
      const text = (input.arguments || "").toLowerCase();
      if (!text) return;
      const dir = path.join(os.homedir(), ".claude", "skills");
      if (!fs.existsSync(dir)) return;

      const matched: string[] = [];
      for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const sf = path.join(dir, d.name, "skill.md");
        if (!fs.existsSync(sf)) continue;
        try {
          const m = fs.readFileSync(sf, "utf8").match(/description:\s*(.+)$/im);
          if (!m) continue;
          const kw = m[1].toLowerCase().split(/\s+/).filter(w => w.length > 3);
          const iw = text.split(/\s+/);
          if (kw.filter(k => iw.some(w => w.includes(k))).length >= 2) {
            matched.push(d.name);
          }
        } catch { continue; }
      }
      if (matched.length) {
        console.log(`[skill-eval] Matched skills: ${matched.join(", ")}`);
      }
    },
  };
};
