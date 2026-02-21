/**
 * Stop Summary Plugin - Quick status check on session update
 * Hook: event (filters for session.updated)
 * Note: OpenCode has no session.idle event; using session.updated as fallback.
 */
import { getGitInfo } from "./lib/common";
import * as fs from "fs";
import * as path from "path";
import type { Plugin } from "@opencode-ai/plugin";

export const StopSummaryPlugin: Plugin = async (ctx) => {
  return {
    async event({ event }) {
      if (event.type !== "session.updated") return;
      // lightweight: no-op unless there are temp files worth flagging
    },
  };
};
