/**
 * Skill Evaluation Plugin - Auto-match skills on command execute
 * Hook: command.execute.before
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { Plugin } from "@opencode-ai/plugin";
import { detectResearchRepoCandidate, getProjectMemoryBinding } from "./lib/common";

function collectSkillNames(skillsDir: string): string[] {
  const names: string[] = [];
  for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const skillFileCandidates = [
      path.join(skillsDir, d.name, "SKILL.md"),
      path.join(skillsDir, d.name, "skill.md"),
    ];
    const skillFile = skillFileCandidates.find((candidate) => fs.existsSync(candidate));
    if (skillFile) names.push(d.name);
  }
  return names;
}

export const SkillEvalPlugin: Plugin = async (ctx) => {
  const binding = getProjectMemoryBinding(ctx.directory);
  const candidate = detectResearchRepoCandidate(ctx.directory);

  return {
    async "experimental.chat.system.transform"(_input, output) {
      if (binding.bound) {
        const memoryPath = binding.memoryPath || ".opencode/project-memory/<project_id>.md";
        const vaultRoot = binding.vaultRoot || "unknown-vault";
        output.system.push(
          `This repository is bound to an Obsidian project knowledge base (project_id=${binding.projectId || "unknown-project"}, vault_root=${vaultRoot}). Treat obsidian-project-memory as the default curator path for research turns, keep ${memoryPath} synchronized when project state changes, and prefer updating canonical notes over creating duplicates.`,
        );
        return;
      }

      if (candidate.candidate) {
        output.system.push(
          "This repository looks like a research-project candidate. When the user is doing project-planning, literature, experiment, result, or writing work, consider obsidian-project-bootstrap as the default path to bind the repo into the Obsidian knowledge base.",
        );
      }
    },

    async "command.execute.before"(input) {
      const text = String(input.arguments || "").toLowerCase();
      if (!text) return;

      const skillsDir = path.join(os.homedir(), ".opencode", "skills");
      if (!fs.existsSync(skillsDir)) return;

      const matched: string[] = [];
      for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const skillFileCandidates = [
          path.join(skillsDir, d.name, "SKILL.md"),
          path.join(skillsDir, d.name, "skill.md"),
        ];
        const skillFile = skillFileCandidates.find((candidate) => fs.existsSync(candidate));
        if (!skillFile) continue;
        try {
          const m = fs.readFileSync(skillFile, "utf8").match(/description:\s*(.+)$/im);
          if (!m) continue;
          const kw = m[1].toLowerCase().split(/\s+/).filter((w) => w.length > 3);
          const iw = text.split(/\s+/);
          if (kw.filter((k) => iw.some((w) => w.includes(k))).length >= 2) matched.push(d.name);
        } catch {
          continue;
        }
      }

      const allSkills = collectSkillNames(skillsDir);
      const researchPrompt = /(paper|papers|literature|review|claim|method|evidence|experiment|result|plan|zotero|文献|论文|实验|结果|计划|obsidian)/i.test(text);
      const hinted: string[] = [];

      if (binding.bound && researchPrompt) {
        for (const skill of ["obsidian-project-memory", "zotero-obsidian-bridge", "obsidian-literature-workflow"]) {
          if (allSkills.includes(skill)) hinted.push(skill);
        }
      } else if (candidate.candidate && researchPrompt && allSkills.includes("obsidian-project-bootstrap")) {
        hinted.push("obsidian-project-bootstrap");
      }

      if (matched.length) {
        console.log(`[skill-eval] Matched skills: ${matched.join(", ")}`);
      }
      if (hinted.length) {
        console.log(`[skill-eval] Research knowledge-base hints: ${hinted.join(", ")}`);
      }
      if (binding.bound && researchPrompt) {
        console.log(`[skill-eval] Bound Obsidian repo detected: ${binding.projectId || "unknown-project"}. Keep Daily/YYYY-MM-DD.md and ${binding.memoryPath || '.opencode/project-memory/<project_id>.md'} in sync when research state changes.`);
      }
    },
  };
};
