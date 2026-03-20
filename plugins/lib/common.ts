/**
 * Shared plugin utilities for OpenCode plugins.
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export interface GitInfo {
  is_repo: boolean;
  branch: string;
  changes_count: number;
  has_changes: boolean;
  changes: string[];
}

export function getGitInfo(cwd: string): GitInfo {
  try {
    execSync("git rev-parse --git-dir", { cwd, stdio: "pipe" });
    let branch = "unknown";
    try {
      branch = execSync("git branch --show-current", { cwd, encoding: "utf8", stdio: "pipe" }).trim();
    } catch {}
    let changes = "";
    try {
      changes = execSync("git status --porcelain", { cwd, encoding: "utf8", stdio: "pipe" });
    } catch {}
    const changeList = changes.trim().split("\n").filter(Boolean);
    return { is_repo: true, branch, changes_count: changeList.length, has_changes: changeList.length > 0, changes: changeList };
  } catch {
    return { is_repo: false, branch: "unknown", changes_count: 0, has_changes: false, changes: [] };
  }
}

export interface TodoInfo {
  found: boolean;
  file: string | null;
  path: string | null;
  total: number;
  done: number;
  pending: number;
}

export function getTodoInfo(cwd: string): TodoInfo {
  const todoFiles = [
    path.join(cwd, "docs", "todo.md"),
    path.join(cwd, "TODO.md"),
    path.join(cwd, ".opencode", "todos.md"),
    path.join(cwd, "TODO"),
    path.join(cwd, "notes", "todo.md"),
  ];
  for (const file of todoFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, "utf8");
        const total = (content.match(/^[-*] \[[ x]\]/gim) || []).length;
        const done = (content.match(/^[-*] \[x\]/gim) || []).length;
        return { found: true, file: path.basename(file), path: file, total, done, pending: total - done };
      } catch { continue; }
    }
  }
  return { found: false, file: null, path: null, total: 0, done: 0, pending: 0 };
}


export interface ProjectMemoryBinding {
  bound: boolean;
  registryPath: string | null;
  memoryPath: string | null;
  projectId: string | null;
  vaultRoot: string | null;
}

export interface ResearchRepoCandidate {
  candidate: boolean;
  markers: string[];
}

export function getProjectMemoryBinding(cwd: string): ProjectMemoryBinding {
  const registryPath = path.join(cwd, ".opencode", "project-memory", "registry.yaml");
  if (!fs.existsSync(registryPath)) {
    return { bound: false, registryPath: null, memoryPath: null, projectId: null, vaultRoot: null };
  }
  try {
    const raw = fs.readFileSync(registryPath, "utf8").trim();
    const data = raw ? JSON.parse(raw) : {};
    const projects = data.projects || {};
    const firstKey = Object.keys(projects)[0];
    if (!firstKey) {
      return { bound: false, registryPath, memoryPath: null, projectId: null, vaultRoot: null };
    }
    const project = projects[firstKey] || {};
    const memoryPath = path.join(cwd, ".opencode", "project-memory", `${firstKey}.md`);
    return {
      bound: true,
      registryPath,
      memoryPath,
      projectId: firstKey,
      vaultRoot: project.vault_root || project.project_root || project.vault_path || null,
    };
  } catch {
    return { bound: false, registryPath, memoryPath: null, projectId: null, vaultRoot: null };
  }
}

export function detectResearchRepoCandidate(cwd: string): ResearchRepoCandidate {
  const markers: string[] = [];
  const checks = [
    ".git",
    "README.md",
    path.join("docs"),
    path.join("notes"),
    path.join("plan"),
    path.join("results"),
    path.join("outputs"),
    path.join("src"),
    path.join("scripts"),
  ];
  for (const rel of checks) {
    if (fs.existsSync(path.join(cwd, rel))) markers.push(rel);
  }
  return { candidate: markers.length >= 3, markers };
}
