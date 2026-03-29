# Progress

> 本文档回答：项目现在长什么样？
>
> 只记录事实状态，不写未来意图。未来意图归 `docs/plan/backlog.md`。

## 更新时间

- 日期：2026-03-29
- 维护人：Agent

## 项目阶段

- 当前阶段：已接入 Agent Workflow，并完成 AVL 可视化页面交付
- 当前里程碑：`web/avl-visualizer.html` 与 `web/avl-visualizer.js` 已落地，PR #2 已创建，等待 Stage 5 / Stage 6 收口

## 已完成功能

- [x] 实现了整数 `node` 结构，包含值、高度、左右子指针和父指针字段。
- [x] 实现了 AVL 树容器的构造、析构和递归释放结点逻辑。
- [x] 实现了基于递归的整数插入，并在插入后按高度差触发再平衡。
- [x] 实现了左旋、右旋、左右旋、右左旋四种旋转。
- [x] 实现了按值搜索结点的递归查找。
- [x] 实现了中序遍历和前序遍历输出。
- [x] 实现了从标准输入读取 10 个整数，并在每次插入后输出当前树的中序、前序结果。
- [x] 新增 `web/avl-visualizer.html` 静态页面，可在浏览器中输入整数序列并渲染 AVL 树 SVG 结构。
- [x] 新增 `web/avl-visualizer.js`，提供 AVL 插入、遍历、布局和 SVG 渲染逻辑，并向浏览器与 issue test 暴露复用 API。
- [x] 新增 `issue_test/2-html-avl-visualizer.sh`，可自动校验 HTML 可视化交付物与 JS AVL 逻辑。

## 已知问题

- `AVLtree::remove(int val)` 和 `AVLtree::__remove(node*, int)` 仅声明未定义，当前删除功能不可用；若后续代码调用该接口，会出现链接失败。

## 技术债

- `node` 结构中的 `parent` 字段已定义，但当前插入、旋转和查找逻辑均未维护或使用该字段。
- 当前代码将树实现、命令行交互和输出逻辑集中在单个 `AVLTree.cpp` 文件中，尚未拆分为独立接口、实现和测试。
- 当前浏览器可视化在 `web/avl-visualizer.js` 中独立实现了一套 AVL 插入逻辑；若后续修改 `AVLTree.cpp` 的平衡行为，需要同步校准两侧实现。
- 当前代码中未发现 `TODO`、`FIXME`、`HACK` 或 `XXX` 注释。
