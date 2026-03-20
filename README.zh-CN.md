<div align="center">
  <img src="LOGO.png" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/OpenCode-Compatible-orange?style=flat-square" alt="OpenCode"/>
  </p>

  <strong>语言</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> 面向学术研究和软件开发的半自动研究助手（OpenCode 版），覆盖构思、编码、实验、报告、写作、rebuttal 与发表，并始终把人的研究判断放在中心位置。

> **说明**：这是 Claude Scholar 的 **OpenCode 分支**。Claude Code 工作流请看 [`main` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)，Codex CLI 工作流请看 [`codex` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/codex)。

## 最新动态

- **2026-03-20**: **OpenCode 分支补齐 Obsidian 工作流** — 将 filesystem-first 的 Obsidian 项目知识库主线同步到 `opencode` 分支：新增 `OBSIDIAN_SETUP.md`、Obsidian project-memory skills、Zotero → Obsidian bridge、`obsidian-*` commands、repo-local `.opencode/project-memory/` 绑定，以及对已绑定科研仓库的 OpenCode plugin 感知。
- **2026-03-18**: **实验报告、写作记忆与更安全的安装更新** — 将实验后流程拆成两层：`results-analysis` 负责严格统计、真实科研图、`analysis-report` / `stats-appendix` / `figure-catalog`，`results-report` 负责完整实验总结报告；移除了冗余的 `data-analyst` 依赖，把 `/analyze-results` 调整为默认的一键分析 + 成稿入口；新增全局 `paper-miner` writing memory 与 `/mine-writing-patterns`；同时把 OpenCode 分支定位收敛为以人类决策为中心的半自动研究助手，并升级安装器为带备份的增量更新模式。
- **2026-02-26**: **Zotero MCP Web/写操作工作流** — 支持远程访问、DOI/arXiv/URL 导入、集合管理、条目更新，并补充了 Claude Code、Codex CLI、OpenCode 三平台的配置说明。
- **2026-02-23**: **OpenCode 安装器** — 新增 `scripts/setup.sh`，支持安全安装到已有 `~/.opencode`。

<details>
<summary>查看历史更新日志</summary>

- **2026-02-25**: Codex CLI 分支 — 新增 `codex` 分支，支持 OpenAI Codex CLI，包含 config.toml、40 个 skills、14 个 agents 和 sandbox 安全机制。
- **2026-02-21**: OpenCode 迁移 — 将整套配置迁移到 OpenCode 格式：hooks → plugins (TypeScript)、agents → `opencode.jsonc`、`CLAUDE.md` → `AGENTS.md`，并保留文件式命令。
- **2026-02-15**: Zotero MCP 集成 — 新增 `/zotero-review` 和 `/zotero-notes`，并围绕 Zotero 文献管理更新研究工作流。
- **2026-01-25**: 项目正式开源，发布 v1.0.0。

</details>

## 快速导航

| 部分 | 作用 |
|---|---|
| [为什么使用 Claude Scholar](#为什么使用-claude-scholar) | 快速理解项目定位和 human-in-the-loop 工作哲学。 |
| [核心工作流](#核心工作流) | 查看从研究构思到发表的分阶段主链路。 |
| [快速开始](#快速开始) | 选择 OpenCode 分支的完整、最小或选择性安装方式。 |
| [平台支持](#平台支持) | 了解这个分支与 `main` / `codex` 的关系。 |
| [集成能力](#集成能力) | 查看这个分支已经产品化的外部系统接入。 |
| [主要工作流](#主要工作流) | 浏览核心研究与开发工作流。 |
| [支撑工作流](#支撑工作流) | 查看支撑主工作流的后台机制。 |
| [文档入口](#文档入口) | 快速跳转到 setup、配置和入口文档。 |
| [引用](#引用) | 在论文、报告或项目文档中引用 Claude Scholar。 |

## 为什么使用 Claude Scholar

Claude Scholar **不是**那种试图替代研究者、追求端到端全自动化科研的系统。

它的核心思想很简单：

> **以人的决策为中心，让助手去加速科研流程，而不是替人做最终判断。**

这意味着 Claude Scholar 更适合承担科研中那些高重复、重结构、但仍需要人来把关的环节，例如文献整理、实验分析、结果汇报、写作辅助以及软件工作流约束；而真正关键的判断始终应该由研究者自己做出：

- 这个问题值不值得做，
- 哪些文献真正重要，
- 哪些假设值得继续验证，
- 哪些结果足够可信，
- 以及什么应该继续推进、写成论文、投稿，或者及时放弃。

换句话说，Claude Scholar 是一个**以人类决策为中心的半自动研究助手**，而不是一个“全自动科研代理”。

## 核心工作流

- **研究构思**：把模糊主题收敛成具体研究问题、研究空白和初步计划。
- **文献工作流**：通过 Zotero 文献集合检索、导入、组织并阅读论文。
- **论文笔记**：把论文转成结构化阅读笔记和可复用论点。
- **知识库**：把稳定知识路由进 Obsidian 的 `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`。
- **实验推进**：跟踪假设、实验线、运行历史、关键发现和下一步动作，并把稳定部分同步回绑定 vault。
- **严格分析**：使用 `results-analysis` 生成严谨统计、真实科研图和分析产物。
- **结果报告**：使用 `results-report` 生成完整实验复盘报告，并写回 Obsidian 的 `Results/Reports/`。
- **写作与发表**：把稳定结论延伸到综述、论文、rebuttal、演示文稿、海报和传播材料中。

## 快速开始

### 前置条件

- [OpenCode](https://github.com/sst/opencode) CLI
- Git
- Node.js（安全合并安装器需要）
- （可选）Python + [uv](https://docs.astral.sh/uv/) 用于 Python 开发
- （可选）[Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) 用于文献工作流
- （可选）[Obsidian Desktop](https://obsidian.md/) 用于 filesystem-first 项目知识库工作流

### 选项 1：完整安装（推荐）

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

安装器支持**带备份的安全增量更新**：
- 更新仓库托管的 `skills/commands/plugins/scripts/utils/AGENTS.md`，
- 将被覆盖文件备份到 `~/.opencode/.claude-scholar-backups/<timestamp>/`，
- 保留 `opencode.jsonc.bak`，
- 保留你已有的 provider、model、auth、API key、permission 与自定义 MCP 配置，
- 只增量合并仓库管理的 `agent/mcp/permission/plugin` 条目，而不是整体覆盖配置文件。

后续增量更新：

```bash
cd /tmp/claude-scholar
git pull --ff-only
bash scripts/setup.sh
```

### 选项 2：最小化安装

只安装较小的一组研究工作流子集：

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

**安装后**：最小化/手动安装**不会自动合并** `opencode.jsonc`；请只复制你需要的 MCP/agent/permission 条目。

**可选 Obsidian 套件**：如果你还想启用绑定式项目知识库工作流，请额外复制 `OBSIDIAN_SETUP.zh-CN.md`、`skills/obsidian-*`、`skills/zotero-obsidian-bridge` 和 `commands/obsidian-*.md` 到 `~/.opencode/`，然后把仓库 `opencode.jsonc` 里的 Obsidian `agent` / `plugin` 条目一并合并进去（两个 Obsidian agents 定义就在里面）。最简单的做法仍然是直接重跑 `bash scripts/setup.sh`。

### 选项 3：选择性安装

按需复制你需要的部分：

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

**安装后**：如果你手动覆盖 `~/.opencode/opencode.jsonc`，请先自行备份本地配置。

## 平台支持

Claude Scholar 目前维护三条相关 CLI 工作流：

- **`main`** — 以 Claude Code 为主线的上游工作流。
- **`codex`** — 面向 Codex CLI 的适配版本，包含 Codex 配置与 hook emulation。
- **`opencode`** — 当前这个分支，聚焦 OpenCode-native 配置、plugins 与 commands 布局。

三条分支共享同一顶层目标：以 human-in-the-loop 的方式支持研究构思、编码、实验、报告、写作与发表。

## 集成能力

### Zotero

适合这些场景：
- 通过 DOI / arXiv / URL 导入论文，
- 按 collection 批量阅读论文，
- 通过 Zotero MCP 读取全文，
- 生成详细论文笔记与文献综合分析。

详见 [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md)。

### Obsidian

当你希望 Claude Scholar 维护一个 filesystem-first 的科研知识库时，使用 Obsidian：
- `Papers/`
- `Knowledge/`
- `Experiments/`
- `Results/`
- `Results/Reports/`
- `Writing/`
- `Daily/`

OpenCode 分支现在也支持通过 `.opencode/project-memory/` 做 repo-local 绑定，并提供完整的 `obsidian-*` 命令面。

详见 [OBSIDIAN_SETUP.zh-CN.md](./OBSIDIAN_SETUP.zh-CN.md)。

## 主要工作流

完整学术研究生命周期 —— 从研究构思到发表的 7 个阶段。

### 1. 研究构思（Zotero 集成）

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `research-ideation` | 把模糊研究主题收敛成结构化问题、研究空白分析和初始研究计划。 |
| Agent | `literature-reviewer` | 搜索、分类并综合论文，形成可执行的文献图景。 |
| Command | `/research-init` | 从文献检索、Zotero 组织到研究提案草稿，一键启动新研究主题。 |
| Command | `/zotero-review` | 对已有 Zotero collection 做结构化文献综述与比较。 |
| Command | `/zotero-notes` | 批量阅读 Zotero collection，并生成结构化论文阅读笔记。 |

**如何工作**
- 用 5W1H 收敛问题；
- 搜索并导入论文到 Zotero；
- 能读全文就读全文；
- 识别研究空白；
- 形成明确问题和下一步计划。

### 2. ML 项目开发

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `architecture-design` | 在新增可注册组件或模块时设计可维护的 ML 项目结构。 |
| Skill | `git-workflow` | 约束 Conventional Commits、分支协作和安全提交流程。 |
| Skill | `bug-detective` | 系统化排查 Python、Bash/Zsh、JS/TS 实现问题。 |
| Command | `/plan` | 把功能请求或修复需求转成可执行实施计划。 |
| Command | `/code-review` | 在合并或发布前审查更改。 |
| Command | `/tdd` | 执行测试驱动开发工作流。 |

**如何工作**
- 保持模块与文件可维护；
- 使用 config-driven 模式；
- 大改动前先计划；
- 推送前先验证。

### 3. 实验分析

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `results-analysis` | 生成由严格统计、真实科研图和分析附录组成的严格分析产物包。 |
| Skill | `results-report` | 把分析产物组织成完整实验总结报告，明确结论、限制和下一步动作。 |
| Command | `/analyze-results` | 一键执行实验后工作流：先做严格分析，再生成最终实验报告。 |

**如何工作**
- 先核对实验产物与比较单位；
- 运行描述统计和推断统计；
- 生成真实图表；
- 写出进入 `Results/Reports/` 的实验报告，并明确 blocker 与 next actions。

### 4. 论文写作

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `ml-paper-writing` | 按 venue 要求起草和修改 ML/AI 论文。 |
| Agent | `paper-miner` | 从强论文中抽取可复用的写作模式、结构信号和 phrasing。 |
| Skill | `citation-verification` | 检查引文格式、元数据准确性和内容 grounding。 |
| Command | `/mine-writing-patterns` | 从一篇或多篇论文更新全局 paper-miner writing memory。 |

**如何工作**
- 整理模板；
- 验证引文；
- 将可复用写作模式沉淀到单一全局 memory；
- 用更强的结构和 phrasing 起草或修订论文。

### 5. 论文自审

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `paper-self-review` | 在投稿前执行系统化论文质量检查。 |

### 6. 投稿与 Rebuttal

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `review-response` | 围绕审稿意见构建结构化、证据驱动的 rebuttal。 |
| Agent | `rebuttal-writer` | 优化审稿回复的语气、结构与应对策略。 |
| Command | `/rebuttal` | 从审稿意见生成完整 rebuttal 草稿。 |

### 7. 录用后处理

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `post-acceptance` | 在论文录用后准备 slides、poster 和宣传材料。 |
| Command | `/presentation` | 生成演讲大纲。 |
| Command | `/poster` | 生成海报规划。 |
| Command | `/promote` | 生成面向公开传播的文案。 |

## 支撑工作流

### 自动化插件工作流

OpenCode 使用的是 **plugins**，不是 Claude Code hooks。

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Plugin | `skill-eval.ts` | 在执行前匹配最相关的 skills。 |
| Plugin | `session-start.ts` | 在会话开始时展示 git 状态和项目上下文。 |
| Plugin | `session-summary.ts` | 在会话结束时总结工作内容。 |
| Plugin | `stop-summary.ts` | 在会话生命周期中提供轻量状态回顾。 |
| Plugin | `security-guard.ts` | 拦截明显危险的命令，并对高风险操作给出警告。 |

### 知识提炼工作流

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Agent | `paper-miner` | 维护唯一的全局 canonical writing memory，供后续写作和 rebuttal 复用。 |
| Agent | `kaggle-miner` | 从 Kaggle 解法中提取可复用的工程模式。 |

### Obsidian 项目知识库

| 类型 | 名字 | 一句话解释 |
|---|---|---|
| Skill | `obsidian-project-memory` | 维护 repo 绑定的 Obsidian 知识库，并决定哪些稳定知识应写回。 |
| Skill | `obsidian-project-bootstrap` | 为新项目或已有科研仓库初始化 / 导入 Obsidian 项目知识库。 |
| Skill | `obsidian-research-log` | 将每日进展、计划、TODO 和里程碑更新路由到知识库。 |
| Skill | `obsidian-experiment-log` | 在 Obsidian 中记录实验设置、运行历史、结果和下一步动作。 |
| Skill | `zotero-obsidian-bridge` | 把 Zotero collection 变成 canonical Obsidian paper notes，并刷新 `Maps/literature.canvas`。 |
| Agent | `literature-reviewer-obsidian` | 读取绑定 vault 中的 paper notes，并生成 filesystem-first 的文献综合。 |
| Agent | `research-knowledge-curator-obsidian` | 作为已绑定仓库的默认 curator，同步 daily / plan / experiment / result 上下文。 |
| Command | `/obsidian-init` | 为当前仓库 bootstrap 或导入 Obsidian 项目知识库。 |
| Command | `/obsidian-ingest` | 把新的 Markdown 文件或目录吸收进正确的 canonical 位置。 |
| Command | `/obsidian-review` | 从绑定 vault 的 paper notes 生成项目关联的文献综合。 |
| Command | `/obsidian-notes` | 规范化 paper notes，并连接到项目上下文、实验与结果。 |
| Command | `/obsidian-link` | 修复或增强 canonical 项目笔记之间的 wikilink。 |
| Command | `/obsidian-sync` | 强制同步仓库、`.opencode/project-memory/` 与绑定 vault 的状态。 |
| Command | `/obsidian-note` | 查找、重命名、归档或彻底删除单个 canonical note。 |
| Command | `/obsidian-project` | 对项目知识库执行 detach / archive / purge / rebuild。 |
| Command | `/obsidian-views` | 按需生成 `.base` 视图和额外 canvas。 |

**如何工作**
- 通过 `.opencode/project-memory/registry.yaml` 绑定 repo，
- 将稳定知识路由到 `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`，
- 保守维护 `Daily/` 与 project memory，
- 默认刷新 `Maps/literature.canvas` 作为文献图谱。

### 技能进化系统

```text
skill-development -> skill-quality-reviewer -> skill-improver
```

当你需要创建、审阅和持续改进复用型 skill 时，就走这条循环。

## 文档入口

- [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md) — Claude Code / Codex CLI / OpenCode 三平台的 Zotero MCP 配置说明。
- [OBSIDIAN_SETUP.zh-CN.md](./OBSIDIAN_SETUP.zh-CN.md) — OpenCode 分支的 filesystem-first Obsidian 知识库工作流。
- [AGENTS.md](./AGENTS.md) — OpenCode 分支的入口指令与工作流说明。
- [README.md](./README.md) — 英文版 README。
- `scripts/setup.sh` — OpenCode 分支的带备份安装器。

## 项目规则

OpenCode 分支仍遵循同一套核心规则：
- 保持文件小而清晰，
- 优先 typed 且可复现的流程，
- 使用 Conventional Commits，
- 小心处理 secrets 与本地凭据，
- 发布或推送前先验证。

## 贡献

这个分支是 Claude Scholar 面向 OpenCode 的实际适配版本。

欢迎围绕以下方向提交改进：
- OpenCode-native 工作流打磨，
- 更安全的安装器行为，
- 文档清理与结构统一，
- Zotero 工作流增强，
- 实验报告与写作工作流质量提升。

## 许可证

MIT License。

## 引用

如果 Claude Scholar 对你的研究或工程工作流有帮助，欢迎引用：

```bibtex
@misc{claudescholar,
  author       = {Gaorui Zhang},
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/Galaxy-Dawn/claude-scholar}
}
```

## 致谢

Claude Scholar 受以下生态与实践启发：
- Claude Code 生态，
- 作为替代 CLI 运行时的 OpenCode，
- Zotero 及更广泛的研究工具链，
- ML/AI 写作与实验分析社区。

### 参考资料

- [OpenCode](https://github.com/sst/opencode)
- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenAI Codex CLI](https://github.com/openai/codex)
- [Zotero](https://www.zotero.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [uv](https://docs.astral.sh/uv/)
