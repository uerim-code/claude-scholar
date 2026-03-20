<div align="center">
  <img src="LOGO.png" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/OpenCode-Compatible-orange?style=flat-square" alt="OpenCode"/>
  </p>

  <strong>Language</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> Semi-automated research assistant for academic research and software development, adapted for OpenCode. Covers ideation, coding, experiments, reporting, writing, rebuttal, and publication while keeping human decision-making at the center.

> **Note**: This is the **OpenCode edition** of Claude Scholar. For the Claude Code workflow, see the [`main` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/main). For Codex CLI, see the [`codex` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/codex).

## Recent News

- **2026-03-20**: **OpenCode Obsidian workflow sync** — ported the filesystem-first Obsidian project knowledge-base workflow into the `opencode` branch: added `OBSIDIAN_SETUP.md`, Obsidian project-memory skills, Zotero → Obsidian bridge skills, `obsidian-*` commands, repo-local `.opencode/project-memory/` binding, and OpenCode plugin awareness for bound research repos.
- **2026-03-18**: **Results reporting, writing memory, and safer installer updates** — split post-experiment work into `results-analysis` for strict statistics, real scientific figures, `analysis-report` / `stats-appendix` / `figure-catalog`, and `results-report` for complete post-experiment reports; removed the redundant `data-analyst` dependency, made `/analyze-results` the default one-shot analysis + report entrypoint, added the global `paper-miner` writing memory with `/mine-writing-patterns`, refreshed the OpenCode positioning around human-centered semi-automation, and upgraded the installer for backup-aware incremental updates.
- **2026-02-26**: **Zotero MCP Web/write workflow** — supports remote access, DOI/arXiv/URL import, collection management, item updates, and safer setup guidance across Claude Code, Codex CLI, and OpenCode.
- **2026-02-23**: **OpenCode installer** — added `scripts/setup.sh` for safe installation into existing `~/.opencode`.

<details>
<summary>View older changelog</summary>

- **2026-02-25**: Codex CLI branch — added `codex` branch supporting OpenAI Codex CLI with config.toml, 40 skills, 14 agents, and sandbox security.
- **2026-02-21**: OpenCode migration — ported the configuration into OpenCode format: hooks → plugins (TypeScript), agents → `opencode.jsonc`, `CLAUDE.md` → `AGENTS.md`, and preserved file-based commands.
- **2026-02-15**: Zotero MCP integration — added `/zotero-review` and `/zotero-notes`, and updated the research workflow around Zotero-backed literature management.
- **2026-01-25**: Project open-sourced, v1.0.0 released.

</details>

## Quick Navigation

| Section | What it helps with |
|---|---|
| [Why Claude Scholar](#why-claude-scholar) | Understand the project positioning and the human-in-the-loop philosophy. |
| [Core Workflow](#core-workflow) | See the staged pipeline from ideation to publication. |
| [Quick Start](#quick-start) | Install Claude Scholar for OpenCode in full, minimal, or selective mode. |
| [Platform Support](#platform-support) | Understand how this branch relates to `main` and `codex`. |
| [Integrations](#integrations) | See which external systems are productized on this branch. |
| [Primary Workflows](#primary-workflows) | Browse the main research and development workflows. |
| [Supporting Workflows](#supporting-workflows) | See the background systems that strengthen the main workflow. |
| [Documentation](#documentation) | Jump to setup docs, config files, and entry documents. |
| [Citation](#citation) | Cite Claude Scholar in papers, reports, or project docs. |

## Why Claude Scholar

Claude Scholar is **not** an end-to-end autonomous research system that tries to replace the researcher.

Its core idea is simple:

> **human decision-making stays at the center; the assistant accelerates the workflow around it.**

That means Claude Scholar is designed to help with the heavy, repetitive, and structure-sensitive parts of research — literature organization, experiment analysis, reporting, writing support, and software workflow hygiene — while still keeping the key judgments in human hands:

- which problem is worth pursuing,
- which papers actually matter,
- which hypotheses are worth testing,
- which results are convincing,
- and what should be written, submitted, or abandoned.

In other words, Claude Scholar is a **semi-automated research assistant**, not a “fully automated scientist.”

## Core Workflow

- **Ideation**: turn a vague topic into concrete questions, research gaps, and an initial plan.
- **Literature**: search, import, organize, and read papers through Zotero collections.
- **Paper notes**: convert papers into structured reading notes and reusable claims.
- **Knowledge base**: route durable knowledge into Obsidian across `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`.
- **Experiments**: track hypotheses, experiment lines, run history, findings, and next actions, then sync the durable parts back into the bound vault.
- **Analysis**: generate strict statistics, real scientific figures, and analysis artifacts with `results-analysis`.
- **Reporting**: produce a complete post-experiment report with `results-report`, then write it back into Obsidian under `Results/Reports/`.
- **Writing and publication**: carry stable findings into literature reviews, papers, rebuttals, slides, posters, and promotion.

## Quick Start

### Prerequisites

- [OpenCode](https://github.com/sst/opencode) CLI
- Git
- Node.js (required for the safe installer merge logic)
- (Optional) Python + [uv](https://docs.astral.sh/uv/) for Python development
- (Optional) [Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) for literature workflows
- (Optional) [Obsidian Desktop](https://obsidian.md/) for the filesystem-first project knowledge base workflow

### Option 1: Full Installation (Recommended)

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

The installer is **backup-aware and incremental-update friendly**:
- updates repo-managed `skills/commands/plugins/scripts/utils/AGENTS.md`,
- backs up overwritten files to `~/.opencode/.claude-scholar-backups/<timestamp>/`,
- keeps `opencode.jsonc.bak`,
- preserves your existing provider, model, auth, API-key, permission, and custom MCP settings,
- merges repo-managed `agent/mcp/permission/plugin` entries instead of replacing the entire config.

To update later:

```bash
cd /tmp/claude-scholar
git pull --ff-only
bash scripts/setup.sh
```

### Option 2: Minimal Installation

Install only a smaller research-focused subset:

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
mkdir -p ~/.opencode/plugins/lib ~/.opencode/skills ~/.opencode/commands
cp /tmp/claude-scholar/plugins/*.ts ~/.opencode/plugins/
cp /tmp/claude-scholar/plugins/lib/common.ts ~/.opencode/plugins/lib/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/results-report ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/review-response ~/.opencode/skills/
cp /tmp/claude-scholar/commands/analyze-results.md ~/.opencode/commands/
cp /tmp/claude-scholar/commands/mine-writing-patterns.md ~/.opencode/commands/
```

**Post-install**: minimal/manual install does **not** auto-merge `opencode.jsonc`; copy only the MCP/agent/permission entries you want.

**Optional Obsidian bundle**: if you also want the bound project knowledge-base workflow, additionally copy `OBSIDIAN_SETUP.md`, `skills/obsidian-*`, `skills/zotero-obsidian-bridge`, and `commands/obsidian-*.md` into `~/.opencode/`, then merge the Obsidian-related `agent` and `plugin` entries from the repo `opencode.jsonc` (the two Obsidian agents live there). The simplest path is still to rerun `bash scripts/setup.sh`.

### Option 3: Selective Installation

Copy only the parts you need:

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
cd /tmp/claude-scholar

cp /tmp/claude-scholar/opencode.jsonc ~/.opencode/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/results-report ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/obsidian-project-memory ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/obsidian-project-bootstrap ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/obsidian-research-log ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/obsidian-experiment-log ~/.opencode/skills/
cp /tmp/claude-scholar/commands/analyze-results.md ~/.opencode/commands/
cp /tmp/claude-scholar/commands/obsidian-sync.md ~/.opencode/commands/
```

**Post-install**: back up your existing `~/.opencode/opencode.jsonc` before manually overwriting it.

## Platform Support

Claude Scholar is maintained across three related CLI workflows:

- **`main`** — Claude Code as the primary upstream workflow.
- **`codex`** — Codex CLI adaptation with Codex-native configuration and hook emulation.
- **`opencode`** — this branch, focused on OpenCode-native config, plugins, and command layout.

The high-level goal is shared across branches: support ideation, coding, experiments, reporting, writing, and publication with a human-in-the-loop workflow.

## Integrations

### Zotero

Use Zotero when you want Claude Scholar to help with:
- paper import via DOI / arXiv / URL,
- collection-based reading workflows,
- full-text access through Zotero MCP,
- detailed paper notes and literature synthesis.

See [MCP_SETUP.md](./MCP_SETUP.md).

### Obsidian

Use Obsidian when you want Claude Scholar to maintain a filesystem-first research knowledge base for:
- `Papers/`
- `Knowledge/`
- `Experiments/`
- `Results/`
- `Results/Reports/`
- `Writing/`
- `Daily/`

The OpenCode branch now supports repo-local binding through `.opencode/project-memory/` and the full `obsidian-*` command surface.

See [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md).

## Primary Workflows

Complete academic research lifecycle — 7 stages from idea to publication.

### 1. Research Ideation (Zotero-Integrated)

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `research-ideation` | Turn vague topics into structured questions, gap analysis, and an initial research plan. |
| Agent | `literature-reviewer` | Search, classify, and synthesize papers into an actionable literature picture. |
| Command | `/research-init` | Start a new topic from literature search to Zotero organization and proposal drafting. |
| Command | `/zotero-review` | Review an existing Zotero collection and generate a structured literature synthesis. |
| Command | `/zotero-notes` | Batch-read a Zotero collection and create structured paper reading notes. |

**How it works**
- use 5W1H to sharpen the problem;
- search and import papers into Zotero;
- read full text where available;
- identify research gaps;
- produce a concrete question and next-step plan.

### 2. ML Project Development

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `architecture-design` | Define maintainable ML project structure when new registrable components or modules are introduced. |
| Skill | `git-workflow` | Enforce Conventional Commits, branching discipline, and safe collaboration flow. |
| Skill | `bug-detective` | Debug implementation failures systematically across Python, Bash/Zsh, and JS/TS. |
| Command | `/plan` | Turn a feature or fix request into an executable implementation plan. |
| Command | `/code-review` | Review changes before merge or publication. |
| Command | `/tdd` | Run a test-driven development workflow. |

**How it works**
- keep files and modules maintainable,
- use config-driven patterns,
- plan before large changes,
- verify before pushing.

### 3. Experiment Analysis

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `results-analysis` | Produce a strict analysis bundle with rigorous statistics, real scientific figures, and analysis artifacts. |
| Skill | `results-report` | Turn analysis artifacts into a complete post-experiment report with decisions, limitations, and next actions. |
| Command | `/analyze-results` | Run the full post-experiment workflow in one shot: strict analysis first, then final report generation. |

**How it works**
- validate experiment artifacts and comparison units,
- run descriptive and inferential statistics,
- generate real figures,
- write a report into `Results/Reports/` with explicit blockers and next actions.

### 4. Paper Writing

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `ml-paper-writing` | Draft and revise ML/AI papers with venue-aware structure and narrative guidance. |
| Agent | `paper-miner` | Mine reusable writing patterns, structure signals, and phrasing from strong papers. |
| Skill | `citation-verification` | Check citation format, metadata accuracy, and grounding. |
| Command | `/mine-writing-patterns` | Update the global paper-miner writing memory from one or more papers. |

**How it works**
- organize templates,
- verify citations,
- mine reusable writing patterns into one global memory,
- draft or revise sections with stronger structure and phrasing.

### 5. Paper Self-Review

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `paper-self-review` | Run a systematic quality review before submission. |

### 6. Submission & Rebuttal

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `review-response` | Build structured, evidence-based rebuttal responses to reviewer comments. |
| Agent | `rebuttal-writer` | Optimize tone, structure, and response strategy for review replies. |
| Command | `/rebuttal` | Generate a complete rebuttal draft from reviewer comments. |

### 7. Post-Acceptance Processing

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `post-acceptance` | Prepare slides, posters, and promotion materials after acceptance. |
| Command | `/presentation` | Create a presentation outline. |
| Command | `/poster` | Create a poster plan. |
| Command | `/promote` | Draft public-facing promotion content. |

## Supporting Workflows

### Automated Plugin Workflow

OpenCode uses **plugins**, not Claude Code hooks.

| Type | Name | One-line explanation |
|---|---|---|
| Plugin | `skill-eval.ts` | Match user requests with the most relevant skills before execution. |
| Plugin | `session-start.ts` | Show git status and project context at session start. |
| Plugin | `session-summary.ts` | Summarize work at session end. |
| Plugin | `stop-summary.ts` | Provide lightweight state updates during the session lifecycle. |
| Plugin | `security-guard.ts` | Block obviously dangerous commands and warn on risky operations. |

### Knowledge Extraction Workflow

| Type | Name | One-line explanation |
|---|---|---|
| Agent | `paper-miner` | Maintain one canonical global writing memory for future drafting and rebuttal work. |
| Agent | `kaggle-miner` | Extract reusable engineering patterns from Kaggle solutions. |

### Obsidian Project Knowledge Base

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `obsidian-project-memory` | Maintain the repo-bound Obsidian knowledge base and decide what durable knowledge should be written back. |
| Skill | `obsidian-project-bootstrap` | Initialize or import a research repository into an Obsidian project knowledge base. |
| Skill | `obsidian-research-log` | Route daily progress, plans, TODOs, and milestone updates into the knowledge base. |
| Skill | `obsidian-experiment-log` | Capture experiment setup, run history, outcomes, and next actions in Obsidian. |
| Skill | `zotero-obsidian-bridge` | Turn Zotero collections into canonical Obsidian paper notes and refresh `Maps/literature.canvas`. |
| Agent | `literature-reviewer-obsidian` | Read bound vault paper notes and generate filesystem-first literature synthesis. |
| Agent | `research-knowledge-curator-obsidian` | Act as the default curator for bound repos and keep daily / plan / experiment / result context synchronized. |
| Command | `/obsidian-init` | Bootstrap or import an Obsidian project knowledge base for the current repository. |
| Command | `/obsidian-ingest` | Ingest a new Markdown file or folder into the correct canonical destination. |
| Command | `/obsidian-review` | Generate project-linked literature synthesis from paper notes in the bound vault. |
| Command | `/obsidian-notes` | Normalize paper notes and connect them to project context, experiments, and results. |
| Command | `/obsidian-link` | Repair or strengthen wikilinks across canonical project notes. |
| Command | `/obsidian-sync` | Force deterministic sync between the repo, `.opencode/project-memory/`, and the bound vault. |
| Command | `/obsidian-note` | Find, rename, archive, or purge a single canonical note. |
| Command | `/obsidian-project` | Detach, archive, purge, or rebuild a project knowledge base. |
| Command | `/obsidian-views` | Generate optional `.base` views and extra canvases on explicit request. |

**How it works**
- bind the repo through `.opencode/project-memory/registry.yaml`,
- route stable knowledge into `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`,
- keep `Daily/` plus project memory updated conservatively,
- refresh `Maps/literature.canvas` as the default literature graph artifact.

### Skill Evolution System

```text
skill-development -> skill-quality-reviewer -> skill-improver
```

Use this loop when creating, auditing, and improving reusable skills inside Claude Scholar.

## Documentation

- [MCP_SETUP.md](./MCP_SETUP.md) — Zotero MCP configuration across Claude Code, Codex CLI, and OpenCode.
- [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md) — filesystem-first Obsidian knowledge-base workflow for the OpenCode branch.
- [AGENTS.md](./AGENTS.md) — OpenCode branch instruction and workflow entry document.
- [README.zh-CN.md](./README.zh-CN.md) — Chinese version of this README.
- `scripts/setup.sh` — backup-aware installer for the OpenCode branch.

## Project Rules

The OpenCode branch still follows the same core project rules:
- maintain small, readable files,
- prefer typed and reproducible workflows,
- use Conventional Commits,
- treat secrets and local credentials carefully,
- verify before publishing or pushing.

## Contributing

This branch is maintained as a practical OpenCode adaptation of Claude Scholar.

Contributions are welcome, especially for:
- OpenCode-native workflow polish,
- safer installer behavior,
- documentation cleanup,
- Zotero workflow improvements,
- reporting and writing workflow quality.

## License

MIT License.

## Citation

If Claude Scholar helps your research or engineering workflow, please cite:

```bibtex
@misc{claudescholar,
  author       = {Gaorui Zhang},
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/Galaxy-Dawn/claude-scholar}
}
```

## Acknowledgments

Claude Scholar builds on ideas from:
- the Claude Code ecosystem,
- OpenCode as an alternative CLI runtime,
- Zotero and the broader research-tooling ecosystem,
- the ML/AI writing and experiment-analysis community.

### References

- [OpenCode](https://github.com/sst/opencode)
- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenAI Codex CLI](https://github.com/openai/codex)
- [Zotero](https://www.zotero.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [uv](https://docs.astral.sh/uv/)
