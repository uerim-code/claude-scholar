# Note Templates

默认使用中文撰写 note；只有用户明确要求其他语言时才切换。

Keep templates lightweight. Use only the sections that are useful.

## Project Overview

```markdown
# 项目概览

## 这个项目研究什么
- ...

## 为什么这个问题难
- ...

## 当前项目定位
- ...

## 目前最成熟的研究分支
- ...
```

## Research Questions

```markdown
# 研究问题

## 问题 1
- ...

## 问题 2
- ...
```

## Experiment Note

```markdown
# 实验名称

## 目标
- ...

## 来自论文或已有结果的动机
- ...

## 设置
- ...

## 主要步骤
- ...

## 更新
- ...

## 发现
- ...

## 晋升到 Results 的条件
- ...

## 下一步
- ...
```

## Result Note

```markdown
# 结果名称

## 核心结论
- ...

## 证据
- ...

## 解读
- ...

## 可延续到写作中的内容
- ...

## 为什么重要
- ...
```

## Results Report Note

```markdown
---
type: results-report
date: YYYY-MM-DD
experiment_line: example-line
round: 1
purpose: transfer-summary
status: active
source_artifacts:
  - analysis-output/analysis-report.md
linked_experiments:
  - Experiments/Example.md
linked_results:
  - Results/Example-Result.md
---

# 示例实验线 / 第 1 轮 / transfer-summary / YYYY-MM-DD

## 执行摘要
- ...

## 实验身份与决策背景
- ...

## 设置与评测协议
- ...

## 主要发现
- ...

## 统计验证
- ...

## 图表逐项解读
- ...

## 失败案例 / 负结果 / 局限性
- ...

## 哪些证据改变了判断
- ...

## 下一步动作
- ...

## 产物与复现索引
- ...
```

## Paper Note

```markdown
# 论文标题

## 引文
- ...

## 核心主张
- ...

## 方法
- ...

## 证据
- ...

## 局限
- ...

## 与当前仓库的直接相关性
- ...

## 与其他论文的关系
- ...
```

## Daily Note

```markdown
# 日志 - YYYY-MM-DD

## 关注重点
- ...

## 进展
- ...

## 后续可沉淀
- ...

## 下一步
- ...
```


## Writing Note

```markdown
# 写作对象名称

## 目的
- ...

## 有哪些结果支撑
- ...

## 论文背景或对比
- ...

## 草拟论点
- ...

## 距离可发表使用还差什么
- ...
```
