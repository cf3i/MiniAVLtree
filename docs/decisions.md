# Decisions

> 本文档回答：之前为什么这样决定的？
>
> 按时间线追加，不按领域分类。历史条目不可修改。

## 当前有效决策摘要

> 此区域由 Stage 6（Entropy Check）维护。当 Superseded 条目过多时，agent 将所有状态为 Accepted 的决策提炼为一句话摘要放在此处。Agent 日常只需读此摘要即可。

（项目初始化后由 Entropy Check 自动维护）

## 维护规则（强制）

1. **只追加，不修改**历史条目内容。
2. 若决策失效，新增一条"替代决策"，并引用旧编号，旧条目状态改为 `Superseded by D-0XX`。
3. 每条必须包含：背景、决策、原因、被拒绝方案。
4. **Compaction 规则**：当 Superseded 条目超过总条目的 30% 时，在 Stage 6 执行 compaction——将所有 Accepted 条目提炼为一句话摘要，更新到"当前有效决策摘要"区域。历史记录区域保持不变。

## 记录模板

```markdown
## D-00X 标题
- 日期：YYYY-MM-DD
- 状态：Proposed | Accepted | Superseded by D-0XX
- 背景：
- 决策：
- 原因：
- 被拒绝方案：
  - 方案 A：拒绝原因
  - 方案 B：拒绝原因
- 影响：
```

## 决策记录

## D-001 初始化 Agent Workflow 文档体系
- 日期：2026-03-29
- 状态：Accepted
- 背景：该仓库在已有代码和实验资产的基础上接入 Agent Workflow Template，需要先把当前事实沉淀为可维护文档，再逐步收敛到统一流程。
- 决策：采用 Agent Workflow Template 的 AGENTS.md + docs/ + issue_test/ + scripts/ 结构。
- 原因：文档驱动的工作流架构，每个文档职责单一且解耦；SubGraph 状态机提供清晰的 Stage 跳转逻辑；issue_test/ + scripts/run_issue_tests.sh 提供按 issue 累积的确定性回归检查；build_context.py 强制 Agent 在正确的 context 下执行。
- 被拒绝方案：
  - 纯 prompt 约束：缺乏持久化和可审计的流程文档
  - 单 README 承载全部规则：难维护，无法结构化引用
- 影响：后续所有 Agent 开发流程按此文档体系执行；stage.lock 记录全局状态，build_context.py 机械组装 context，issue_test/ 持续沉淀历史回归脚本。

## D-002 以独立静态页面交付 AVL 可视化
- 日期：2026-03-29
- 状态：Accepted
- 背景：用户要求补一个 HTML 页面来可视化 AVL 树，但当前仓库只有单文件 C++ 命令行示例，尚未抽出可复用的本地库接口。
- 决策：新增独立的 `web/` 静态页面与 JavaScript AVL 逻辑，用浏览器可视化插入结果，同时保留现有 `AVLTree.cpp` 命令行示例不变。
- 原因：这样可以最小代价满足可视化需求，并避免先做大规模 C++ 结构重组；同时 issue test 可以直接验证页面依赖的 JS 逻辑。
- 被拒绝方案：
  - 直接重写现有 C++ 程序为前后端共享库：改动面过大，不适合作为本次单 issue 闭环
  - 只写静态示意图、不落地可执行逻辑：无法形成可重复验证的可视化结果
- 影响：仓库将从纯命令行示例扩展为“命令行示例 + 静态浏览器可视化”，后续需要在 `docs/architecture.md` 与 `docs/progress.md` 中同步记录 `web/` 目录职责。
