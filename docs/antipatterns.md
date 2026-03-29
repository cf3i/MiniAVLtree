# Antipatterns

> 被历史 issue 验证会导致失败的做法。
>
> 记录"这类做法为什么会失败"，而不是"卡在哪里"（那是 blockers.md 的职责）。

## 维护规则

1. 只在 Stage 5（Reflection）写入，禁止在其他 Stage 追加
2. 每条必须有来源 blocker 编号或 issue_id，不写假设性警告
3. 失败信号（早期症状）为必填——让 Agent 在走向失败之前就能识别
4. 正确替代做法为必填——不只是"不要做 X"，要给出具体替代方案
5. 只追加，不修改历史条目

## 记录模板

```markdown
## A-00X 标题

- 来源：<B-00X blocker> / <issue_id>
- 失败信号（早期症状）：
- 根本原因：
- 正确替代做法：
```

## 反模式记录

## A-001 不要把 `gh --jq` 的带引号表达式直接嵌进 shell 的双引号命令替换里

- 来源：`2-html-avl-visualizer`
- 失败信号（早期症状）：PR 创建或 merge 动作已经成功，但脚本额外输出 `failed to parse jq expression`，问题通常出现在 `\"\"` 之类的手工转义片段附近。
- 根本原因：shell 双引号、命令替换和 `gh --jq` 表达式三层引号叠在一起后，极易发生过度转义或错误截断，导致 GitHub CLI 在输出元数据阶段解析失败。
- 正确替代做法：先把 `gh pr view --jq ...` 的结果读到局部变量，再单独输出 `KEY=$value`；不要在 `echo "KEY=$( ... )"` 里直接拼复杂 jq 表达式。
