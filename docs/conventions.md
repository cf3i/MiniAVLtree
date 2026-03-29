# Conventions

> 本文档回答：代码长什么样？git 操作怎么做？
>
> 收录标准：本文档只收录**靠 agent 自觉遵守**的风格性约束。被 linter / CI 机械执行的结构性规则归 `architecture.md`。

## 命名规范

- 文件名：当前未统一。现有 C++ 源文件使用 `PascalCase` 风格文件名，如 `AVLTree.cpp`；Python / Bash 脚本使用 `snake_case`，如 `build_context.py`、`run_issue_tests.sh`。
- 类名：C++ 类当前使用首字母大写的混合命名，如 `AVLtree`；不是严格的 `PascalCase`。
- 变量和函数：按语言分别沿用现有写法。C++ 公共方法多为 `camelCase`，如 `inOrder`、`preOrder`、`insert`；私有辅助函数带 `__` 前缀，如 `__insert`、`__LRotate`。Python / Bash 函数使用 `snake_case`，如 `get_repo_root`、`normalize_path`。局部变量以小写短名或 `snake_case` 为主。
- 常量：Python 模块级常量和 Shell 全局变量使用 `UPPER_SNAKE_CASE`，如 `GLOBAL_FILES`、`OPTIONAL_GLOBAL_FILES`、`ROOT_DIR`、`ISSUE_TEST_DIR`。

## 函数契约

1. C++ 函数签名显式写出参数和返回类型；对树节点的空值和子树更新通过 `node*`、`node*&` 表达，递归辅助函数通常返回更新后的子树根节点。
2. Python / Bash 脚本函数以过程式封装为主。Python 当前未使用 type hints；Bash 无类型声明，主要通过命名和参数位置表达语义。
3. 公共入口函数与辅助函数分层较明显。以 `AVLtree` 为例，公开方法负责暴露操作，递归细节放在私有辅助函数中。
4. 当前代码库未见统一的返回对象封装或错误类型抽象；函数契约主要依赖显式返回值、空指针判断和进程退出码。

## 错误处理模式

- 错误表示方式：当前按语言分散处理。C++ 代码未见异常处理，主要通过 `nullptr` 判断和直接返回；Python 脚本在检测到缺失文件或非法 stage 时向 `stderr` 输出信息并 `sys.exit(1)`；Bash 脚本启用 `set -euo pipefail`，参数或目录异常时输出 `ERROR:` 并 `exit 1`。
- 日志级别约定：当前未配置统一日志框架。现有脚本只观察到文本前缀 `FATAL`、`ERROR`、`SKIP`、`PASS`、`FAIL`。
- 重试策略：当前未配置；现有脚本在失败时直接退出，不做自动重试。

## Git 规范

### Commit Message

- 当前最近提交记录只有 1 条：`Add files via upload`。
- 现有历史未体现 Conventional Commits，也看不出固定的 `type(scope): subject` 模式。
- subject 当前可观察到为英文自由格式；更细的 commit message 规范为`（待填写）`。

### Branch 命名

- 当前仅能观察到 `main` 和 `origin/main`。
- 功能分支或修复分支的命名习惯为`（待填写）`。

### PR 规范

- 当前未发现 PR template。
- PR 标题格式、描述必填项当前未配置。

## 维护规则

1. 风格冲突时，以本文件为准。
2. 引入新模式前先补充本文件再推广。
3. 当某条规则被 linter 强制执行后，从本文件迁移到 `architecture.md`。
