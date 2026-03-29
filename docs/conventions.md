# Conventions

> 本文档回答：代码长什么样？git 操作怎么做？
>
> 收录标准：本文档只收录**靠 agent 自觉遵守**的风格性约束。被 linter / CI 机械执行的结构性规则归 `architecture.md`。

## 命名规范

- 文件名：文档、Python、Shell 文件目前以小写 `snake_case` 为主，如 `build_context.py`、`deliver_pr.sh`、`run_issue_tests.sh`、`docs/quality.md`；现有 C++ 主文件为 `AVLTree.cpp`，仓库当前未形成跨语言统一的文件名 case 约束。
- 类名：当前未形成统一规范；现有 C++ 类型同时出现 `AVLtree` 和 `node`。
- 变量和函数：按语言贴合现有写法。Python / Shell 以 `snake_case` 为主，如 `get_repo_root`、`default_pr_title`、`resolve_files`；C++ 成员函数以 `camelCase` 为主，如 `inOrder`、`preOrder`、`search`，递归辅助函数使用 `__insert`、`__search` 这类双下划线前缀。
- 常量：Python 模块级常量和 Shell 全局变量使用 `UPPER_SNAKE_CASE`，如 `GLOBAL_FILES`、`OPTIONAL_GLOBAL_FILES`、`STAGE_FILES`、`ROOT_DIR`、`ISSUE_TEST_DIR`；当前 C++ 示例代码中未见独立常量定义。

## 函数契约

1. C++ 函数签名显式写出参数和返回类型；树操作通过成员函数直接修改对象状态，递归辅助函数在需要回写子树根时使用 `node*&` / `node*` 传参，例如 `node* __insert(node*& p, int val)`。
2. Python 当前未使用 type hints；函数契约主要靠函数名、docstring、`argparse` 参数声明和返回值结构表达，例如 `resolve_files` 返回 `(required_files, optional_files)` 二元组。
3. Bash 函数以位置参数接收输入，通过 stdout 输出结果、通过 exit code 表示成功或失败，例如 `current_branch`、`resolve_repo`；需要中止时直接 `exit 1`。

## 错误处理模式

- 错误表示方式：脚本以 fail-fast 为主。Python 通过向 stderr 打印信息后 `sys.exit(1)` 结束；Bash 统一启用 `set -euo pipefail`，校验失败时输出错误并 `exit 1`；现有 C++ 代码主要依赖空指针判断和返回 `node*`，未见异常处理、`Result` 类型或统一错误码。
- 日志级别约定：当前未配置统一日志框架或分级标准；普通状态信息直接 `echo` / `print`，错误信息通常带 `ERROR:` 或 `[build_context] FATAL:` 前缀并写入 stderr。
- 重试策略：当前未配置；现有脚本默认失败即退出，不自动重试。

## Git 规范

### Commit Message

- 最近可见提交样式为自由格式英文短句：`Add files via upload`。
- 当前未形成 conventional commits 或固定的 `<type>(<scope>): <subject>` 约束。
- subject 语言：当前样本为英文；仓库级统一语言规范当前未配置。

### Branch 命名

- 默认主分支为 `main`。
- 当前可见工作分支样式为 `codex/<issue_id>-<description>`，例如 `codex/1-avl-html-visualizer`。
- 该命名是否为强制规则：当前未配置；至少现有远端功能分支遵循这一模式。

### PR 规范

- 仓库内未发现 PR template。
- 标题格式：当前未配置固定规则；辅助脚本 `scripts/deliver_pr.sh` 默认取最近一个非 `chore(stage):` commit subject 作为 PR 标题。
- 描述必填项：当前未配置固定必填项；同一脚本默认生成只包含 `Summary` 和 `Testing` 两段的最小正文。

## 维护规则

1. 风格冲突时，以本文件为准。
2. 引入新模式前先补充本文件再推广。
3. 当某条规则被 linter 强制执行后，从本文件迁移到 `architecture.md`。
