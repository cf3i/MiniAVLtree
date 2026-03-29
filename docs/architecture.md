# Architecture

> 本文档回答：什么东西在哪里？什么能依赖什么？
>
> 收录标准：本文档只收录**被 linter / CI 机械执行**的结构性约束。靠 agent 自觉遵守的风格性规则归 `conventions.md`。

## 分层模型

| 层级 | 职责 | 允许依赖 | 禁止依赖 |
| --- | --- | --- | --- |
| `根目录源码` | `AVLTree.cpp` 同时承载 AVL 树数据结构、操作实现和 `main` 入口，当前是单翻译单元实现 | C++ 标准库头文件（当前可确认仅 `#include <iostream>`） | 当前未配置 |
| `scripts/` | 仓库辅助脚本，负责 workflow 上下文组装和 issue 回归脚本调度 | Python 标准库、`yaml`、shell 命令，以及 `docs/`、`issue_test/` 下的文件路径 | 当前未配置 |
| `issue_test/` | issue 级回归脚本目录；当前只有 `README.md` 约定，未发现实际 `.sh` 回归脚本 | Bash 脚本和项目可执行命令（按 README 约定） | 当前未配置 |
| `docs/` | workflow 和仓库说明文档，不承载可 import 的业务代码 | 无项目内代码依赖 | 不适用 |

## 目录结构

```
.
├── AVLTree.cpp              # 唯一的 C++ 源文件，包含 AVL 树实现与 main 入口
├── docs/                    # Agent Workflow Template 文档和仓库说明
│   ├── plan/                # 当前计划与归档计划
│   └── workflow/            # stage1-stage6 工作流说明
├── issue_test/              # issue 回归测试目录；当前只有 README 约定
│   └── README.md            # issue_test 的命名、契约和执行方式
└── scripts/                 # 自动化辅助脚本
    ├── build_context.py     # 按 stage 解析需要加载的文档列表
    └── run_issue_tests.sh   # 统一执行 issue_test/*.sh
```

## Import Boundary 规则

1. `AVLTree.cpp` 可以 include C++ 标准库头文件；当前未发现任何项目内头文件或其他 C++ 模块依赖。
2. `scripts/build_context.py` 可以 import `argparse`、`os`、`sys`、`yaml`；当前未发现它 import 仓库内其他 Python 模块。
3. `scripts/run_issue_tests.sh` 当前不 source 项目内其他脚本；它只遍历并执行 `issue_test/*.sh`。
4. 项目级“谁禁止 import 谁”的机械边界规则当前未配置；仓库内未发现用于校验 import boundary 的 lint 或 CI 配置。

## 执行方式

- 静态检查工具：当前未配置（仓库内未发现 `clang-tidy`、`clang-format`、`pylint`、`shellcheck`、`eslint` 等工具声明或版本锁定）
- 规则文件位置：当前未配置
- CI 校验命令：当前未配置（仓库内未发现 `.github/workflows/`、`.gitlab-ci.yml`、`Jenkinsfile` 等 CI 文件）

## 维护规则

1. 修改边界前先记录决策到 `docs/decisions.md`。
2. 边界变化必须同步更新 lint 规则。
3. lint 规则未更新前，不算架构更新完成。
