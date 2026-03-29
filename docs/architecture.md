# Architecture

> 本文档回答：什么东西在哪里？什么能依赖什么？
>
> 收录标准：本文档只收录**被 linter / CI 机械执行**的结构性约束。靠 agent 自觉遵守的风格性规则归 `conventions.md`。

## 分层模型

当前仓库未形成经典的 `interface / application / domain / infrastructure` 分层，也未配置 linter / CI 对分层进行机械校验。以下按当前代码与目录的实际模块边界描述。

| 层级 | 职责 | 允许依赖 | 禁止依赖 |
| --- | --- | --- | --- |
| `program` (`AVLTree.cpp`) | 单文件实现 AVL 树结点、树操作与 `main` 交互入口 | C++ 标准库头文件；当前文件内定义的类型与函数 | `scripts/`、`issue_test/`、`docs/`；当前仓库也没有可供其引用的本地头文件或库 |
| `web` (`web/`) | 静态浏览器可视化页面与前端 AVL 逻辑 | 浏览器 DOM / SVG API；`web/avl-visualizer.js` 自身导出的 API | `AVLTree.cpp` 的编译期符号；`scripts/`、`issue_test/`、`docs/` 作为运行时依赖 |
| `automation` (`scripts/`) | 工作流辅助脚本，包括 stage 上下文构建、issue 回归执行、PR 交付 | Bash/Python 标准能力；仓库文件路径；`build_context.py` 额外依赖第三方 `yaml` | `AVLTree.cpp` 的编译期符号；当前仓库未提供可复用的 C++ 库接口 |
| `regression` (`issue_test/`) | issue 级回归脚本目录；当前仅有 `README.md` 说明，未见实际 `.sh` 用例 | Shell 命令；由 `scripts/run_issue_tests.sh` 发现并执行 | 作为被其他模块 import/source 的共享脚本库；当前目录未暴露公共接口 |
| `documentation` (`docs/`) | Agent Workflow Template 与项目说明文档 | 无运行时依赖；可被人工或脚本按路径读取 | 作为程序运行时依赖；当前无代码从文档目录导入可执行逻辑 |

## 目录结构

```
.
├── AVLTree.cpp              # 单文件 AVL 树实现与 main 交互入口
├── docs/                    # Workflow 文档与项目说明
│   ├── plan/                # 计划文档目录
│   └── workflow/            # stage 指令模板目录
├── issue_test/              # issue 回归目录；当前仅 README 约定
│   └── README.md            # issue_test 脚本命名与执行合约
├── scripts/                 # 自动化脚本目录
    ├── build_context.py     # 按 stage 输出需要加载的文档/测试文件列表
    ├── deliver_pr.sh        # 使用 git/gh 创建或合并 PR
    └── run_issue_tests.sh   # 顺序执行 issue_test/*.sh
└── web/                     # 静态 AVL 可视化页面与前端逻辑
    ├── avl-visualizer.html  # 浏览器页面与样式
    └── avl-visualizer.js    # AVL 构建、遍历、布局与 SVG 渲染逻辑
```

## Import Boundary 规则

当前未配置 lint/CI 对 import boundary 做机械校验。以下仅记录代码中能直接确认的依赖方向。

1. `AVLTree.cpp` 可以 `#include` C++ 标准库；禁止 import 仓库内其他模块，当前也未见本地头文件或多源文件依赖。
2. `web/avl-visualizer.js` 可以依赖浏览器 DOM / SVG API，也可以通过 CommonJS 导出纯函数给 issue test 复用；禁止直接调用 `AVLTree.cpp` 内部符号，当前仓库也未提供 C++ 到 Web 的桥接层。
3. `scripts/build_context.py` 可以 import Python 标准库与第三方 `yaml`；禁止 import 仓库内其他 Python 模块，当前仓库未形成可复用的 Python 包。
4. `scripts/run_issue_tests.sh` 可以执行 `issue_test/*.sh`；禁止把 `issue_test/` 当作可被 `source` 的共享 shell 库，当前目录中也未定义公共 shell 接口。
5. `docs/` 与 `issue_test/` 当前只通过文件路径被读取或执行；禁止把其中内容当作编译期或链接期代码依赖。

## 执行方式

- 静态检查工具：当前未配置（手动执行）；未发现 `clang-tidy`、`clang-format`、`eslint`、`pylint` 等 lint 配置或版本声明。
- 规则文件位置：当前未配置
- CI 校验命令：当前未配置（手动执行）；未发现 `.github/workflows/`、`.gitlab-ci.yml`、`Jenkinsfile`。仓库内可手动运行 `bash scripts/run_issue_tests.sh` 执行 issue 回归，但当前不是 CI 自动校验。

## 维护规则

1. 修改边界前先记录决策到 `docs/decisions.md`。
2. 边界变化必须同步更新 lint 规则。
3. lint 规则未更新前，不算架构更新完成。
