/**
 * Session Start Plugin - Display project status on session.created
 * Hook: event (filters for session.created)
 */
import { getGitInfo, getTodoInfo } from "./lib/common";
import type { Plugin } from "@opencode-ai/plugin";

export const SessionStartPlugin: Plugin = async (ctx) => {
  return {
    async event({ event }) {
      if (event.type !== "session.created") return;
      const cwd = ctx.directory;
      const git = getGitInfo(cwd);
      const todo = getTodoInfo(cwd);
      let msg = `📂 ${cwd}\n`;
      if (git.is_repo) {
        msg += `Branch: ${git.branch}`;
        msg += git.has_changes ? ` | ${git.changes_count} uncommitted\n` : " | clean\n";
      }
      if (todo.found) {
        msg += `Todos: ${todo.pending} pending / ${todo.done} done\n`;
      }
      console.log(msg);
    },
  };
};
