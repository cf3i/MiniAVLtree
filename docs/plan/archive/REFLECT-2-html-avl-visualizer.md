# REFLECT-2-html-avl-visualizer

## 1. 本次遇到的问题

- 在真实 GitHub 仓库回归里，`scripts/deliver_pr.sh ensure` 虽然成功创建了 PR，但 `MERGE_COMMIT_SHA` 的 `gh --jq` 表达式因为 shell 引号写法错误，额外打印了 `failed to parse jq expression`。
- HTML 可视化页面本身没有阻塞性问题；关键工作量集中在把 AVL 逻辑拆成浏览器可渲染、Node 也可直接调用的纯函数接口。

## 2. 是否有新 wisdom 条目

- 是。
- 原因：把 AVL 构建、遍历和布局逻辑放进可被浏览器与 Node 共同消费的 JS 模块后，页面渲染与 issue test 可以共享同一套行为基线，不需要再引入浏览器自动化。

## 3. 是否有新 antipattern 条目

- 是。
- 原因：把 `gh --jq` 的带引号表达式直接塞进 shell 的双引号 `echo "$( ... )"` 中很脆弱，真实运行时很容易出现引号逃逸错误，导致交付脚本在关键元数据输出阶段喷错。
