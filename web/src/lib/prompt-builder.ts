import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");

function readFileIfExists(filePath: string): string | null {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, "utf-8");
  }
  return null;
}

function findSkillContent(skillId: string): string | null {
  const skillDir = path.join(PROJECT_ROOT, "skills", skillId);
  if (!existsSync(skillDir)) return null;

  const skillFile = path.join(skillDir, "SKILL.md");
  if (existsSync(skillFile)) {
    return readFileSync(skillFile, "utf-8");
  }

  // Try to read any .md file in the skill directory
  const files = readdirSync(skillDir).filter((f) => f.endsWith(".md"));
  if (files.length > 0) {
    return readFileSync(path.join(skillDir, files[0]), "utf-8");
  }

  return null;
}

function findCommandContent(commandName: string): string | null {
  // Remove leading /
  const name = commandName.replace(/^\//, "");

  // Check if it's a /sc command
  if (name.startsWith("sc ")) {
    const subCmd = name.replace("sc ", "");
    const filePath = path.join(PROJECT_ROOT, "commands", "sc", `${subCmd}.md`);
    if (existsSync(filePath)) return readFileSync(filePath, "utf-8");
  }

  const filePath = path.join(PROJECT_ROOT, "commands", `${name}.md`);
  if (existsSync(filePath)) return readFileSync(filePath, "utf-8");

  return null;
}

function findAgentContent(agentName: string): string | null {
  const filePath = path.join(PROJECT_ROOT, "agents", `${agentName}.md`);
  if (existsSync(filePath)) return readFileSync(filePath, "utf-8");
  return null;
}

function getClaudeMd(): string {
  return readFileIfExists("CLAUDE.md") || "";
}

export interface PromptContext {
  systemPrompt: string;
  userPrompt: string;
  sourceFile: string;
  type: "skill" | "command" | "agent" | "custom";
}

export function buildPrompt(command: string, userInput?: string): PromptContext {
  const claudeMd = getClaudeMd();
  const baseSystem = `Sen Claude Scholar arastirma asistanisin. Turkce yanit ver.
Asagida proje yapilandirmasi var:\n\n${claudeMd.substring(0, 3000)}`;

  // Check if it's a slash command
  if (command.startsWith("/")) {
    const cmdContent = findCommandContent(command);
    if (cmdContent) {
      return {
        systemPrompt: `${baseSystem}\n\n--- KOMUT TANIMI ---\n${cmdContent}`,
        userPrompt: userInput || `${command} komutunu calistir ve sonuclari Turkce olarak raporla.`,
        sourceFile: `commands/${command.replace(/^\//, "")}.md`,
        type: "command",
      };
    }
  }

  // Check if it's an agent command
  if (command.startsWith("agent:")) {
    const agentName = command.replace("agent:", "");
    const agentContent = findAgentContent(agentName);
    if (agentContent) {
      return {
        systemPrompt: `${baseSystem}\n\n--- AJAN TANIMI ---\n${agentContent}`,
        userPrompt: userInput || `${agentName} ajanini baslat ve gorevini Turkce olarak acikla.`,
        sourceFile: `agents/${agentName}.md`,
        type: "agent",
      };
    }
  }

  // Check if it's a skill
  if (command.startsWith("skill:")) {
    const skillId = command.replace("skill:", "");
    const skillContent = findSkillContent(skillId);
    if (skillContent) {
      return {
        systemPrompt: `${baseSystem}\n\n--- YETENEK TANIMI ---\n${skillContent}`,
        userPrompt: userInput || `${skillId} yetenegini kullanarak gorevi baslat ve sonuclari Turkce raporla.`,
        sourceFile: `skills/${skillId}/SKILL.md`,
        type: "skill",
      };
    }
  }

  // For /sc agent commands that reference skills
  if (command.startsWith("/sc agent ")) {
    const skillId = command.replace("/sc agent ", "");
    const skillContent = findSkillContent(skillId);
    if (skillContent) {
      return {
        systemPrompt: `${baseSystem}\n\n--- YETENEK TANIMI ---\n${skillContent}`,
        userPrompt: userInput || `${skillId} yetenegini kullanarak gorevi baslat ve sonuclari Turkce raporla.`,
        sourceFile: `skills/${skillId}/SKILL.md`,
        type: "skill",
      };
    }
  }

  // Fallback - custom command
  return {
    systemPrompt: baseSystem,
    userPrompt: userInput || command,
    sourceFile: "CLAUDE.md",
    type: "custom",
  };
}

export function listAvailableSkills(): string[] {
  const skillsDir = path.join(PROJECT_ROOT, "skills");
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir).filter((f) => {
    const fullPath = path.join(skillsDir, f);
    return existsSync(path.join(fullPath, "SKILL.md")) || readdirSync(fullPath).some((ff) => ff.endsWith(".md"));
  });
}

export function listAvailableCommands(): string[] {
  const cmdsDir = path.join(PROJECT_ROOT, "commands");
  if (!existsSync(cmdsDir)) return [];
  return readdirSync(cmdsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => "/" + f.replace(".md", ""));
}

export function listAvailableAgents(): string[] {
  const agentsDir = path.join(PROJECT_ROOT, "agents");
  if (!existsSync(agentsDir)) return [];
  return readdirSync(agentsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}
