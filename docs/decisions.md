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

## D-002 为 AVL 树增加静态 HTML 可视化入口
- 日期：2026-03-29
- 状态：Accepted
- 背景：当前仓库只有命令行 C++ 示例代码，用户新增了“用 HTML 可视化 AVL tree”的功能需求，该需求超出了初始化时 overview 中“无图形界面”的范围描述。
- 决策：在保持现有 C++ 示例代码不变的前提下，新增一个独立的静态 HTML + JavaScript 可视化页面，用浏览器渲染 AVL 树节点结构和插入结果。
- 原因：静态页面最适合这个仓库当前的轻量结构，不要求引入构建系统、后端服务或把 C++ 编译到浏览器；同时页面脚本可通过 Node 直接加载，便于 issue_test 做确定性验收。
- 被拒绝方案：
  - 把现有 C++ 代码直接编译到浏览器：实现成本高，需要额外工具链，超出当前仓库复杂度
  - 只补截图或静态示意图：不能交互输入，也不能作为可执行验收结果
- 影响：项目范围从“仅命令行示例”扩展为“命令行示例 + 本地静态可视化页面”；后续文档和回归脚本需要同时覆盖这两个入口。
