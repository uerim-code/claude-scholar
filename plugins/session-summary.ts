/**
 * Session Summary Plugin - Work log on session.deleted
 * Hook: event (filters for session.deleted)
 */
import { getGitInfo, getTodoInfo } from "./lib/common";
import * as fs from "fs";
import * as path from "path";
import type { Plugin } from "@opencode-ai/plugin";

export const SessionSummaryPlugin: Plugin = async (ctx) => {
  return {
    async event({ event }) {
      if (event.type !== "session.deleted") return;
      const cwd = ctx.directory;
      const logDir = path.join(cwd, ".claude", "logs");
      fs.mkdirSync(logDir, { recursive: true });

      const now = new Date();
      const ds = now.toISOString().split("T")[0].replace(/-/g, "");
      const logFile = path.join(logDir, `session-${ds}.md`);

      const git = getGitInfo(cwd);
      const todo = getTodoInfo(cwd);

      let log = `# Work Log - ${path.basename(cwd)}\n\n`;
      log += `**Time**: ${now.toISOString()}\n\n## Changes\n`;
      if (git.is_repo && git.has_changes) {
        for (const c of git.changes) log += `- ${c}\n`;
      } else {
        log += "No changes\n";
      }
      log += `\n## Next Steps\n`;
      if (git.has_changes) log += `- Uncommitted: ${git.changes_count} files\n`;
      if (todo.found && todo.pending > 0) log += `- Todos: ${todo.pending} pending\n`;

      fs.writeFileSync(logFile, log, "utf8");
    },
  };
};
