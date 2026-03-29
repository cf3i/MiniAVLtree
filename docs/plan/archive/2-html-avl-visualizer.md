# Current Plan

## 当前状态

- 任务名称：为 AVL 树新增 HTML 可视化页面
- issue_id：`2-html-avl-visualizer`
- 开始日期：2026-03-29
- 当前阶段：Stage 2 已规划，准备进入 Stage 3
- 当前 issue 测试脚本：`issue_test/2-html-avl-visualizer.sh`
- 历史回归基线命令：`bash scripts/run_issue_tests.sh --exclude issue_test/2-html-avl-visualizer.sh`
- 完整回归命令：`bash scripts/run_issue_tests.sh`

## 风险提示

- 该任务把项目从纯命令行示例扩展到静态浏览器可视化，已同步更新 `docs/overview.md` 并记录决策。
- 新增前端逻辑不能破坏现有 `AVLTree.cpp` 的命令行示例，也不应要求引入额外构建系统。

## 执行步骤

- [x] 运行历史 issue 回归基线：`bash scripts/run_issue_tests.sh --exclude issue_test/2-html-avl-visualizer.sh`
- [x] 运行当前 issue 测试脚本，确认仓库当前还没有 HTML 可视化交付物：`bash issue_test/2-html-avl-visualizer.sh`
- [x] 新增 `web/avl-visualizer.html` 与 `web/avl-visualizer.js`，支持输入整数序列并渲染 AVL 树结构
- [x] 在页面中展示插入序列、中序遍历、前序遍历和错误提示
- [x] 根据新增 `web/` 模块更新相关项目文档
- [x] 运行完整回归：`bash scripts/run_issue_tests.sh`

## 交付记录

- PR：[#2 feat(web): add avl tree visualizer](https://github.com/cf3i/MiniAVLtree/pull/2)
- 远端状态：PR 已创建；Stage 6 将尝试最终 merge
- 本地交付 commit hash：`955230b` (`feat(web): add avl tree visualizer`)
- 验证记录：
  - `bash issue_test/2-html-avl-visualizer.sh`
  - `bash scripts/run_issue_tests.sh`
  - `node --check web/avl-visualizer.js`
- 最终结论：已为当前仓库新增静态 AVL HTML 可视化页面，浏览器端可输入整数序列并查看树结构、中序遍历与前序遍历。

## 维护说明

- 该 issue 已归档；对应测试脚本继续保留在 `issue_test/2-html-avl-visualizer.sh`。
- 若 Stage 6 无法完成最终 merge，需要在本文件追加 merge handoff。
