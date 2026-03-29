# Security

> 本文档回答：什么不能碰？什么要小心？

## 敏感信息清单

- `.gitignore`：当前仓库未配置，未看到被排除的敏感文件模式。
- `.env*` / `.env.example`：当前未发现。
- 环境变量读取：在源码与脚本中未检索到 `process.env`、`os.environ`、`os.Getenv`、`getenv(...)` 等读取语句。
- CI secrets 引用：当前未发现；仓库内也未看到 `.github/workflows/`。

| 类型 | 示例 | 存储方式 | 禁止行为 |
| --- | --- | --- | --- |
| 当前未发现已声明的敏感环境变量 | `（待填写）` | 当前未配置 `.env.example`，代码中也未发现环境变量读取 | 不要在源码、脚本、文档、测试样例或日志中新增明文凭据 |

## 受保护路径

- `scripts/deliver_pr.sh`：交付/提交流程脚本，不应被 agent 随意修改。
- `scripts/run_issue_tests.sh`：回归测试入口脚本，影响质量门执行结果。
- `scripts/build_context.py`：Workflow 上下文装配脚本，内含对 `docs/stage.lock`、`docs/workflow/stage*.md` 等固定路径依赖。
- `docs/workflow/`：Agent Workflow Template 指令文件，属于流程基础设施。
- `docs/stage.lock`：阶段状态文件，属于流程控制数据。
- `.git/`：Git 元数据与初始化日志目录，不应作为业务改动目标。
- 当前未配置 `infra/`、`secrets/`、`.github/workflows/` 等独立基础设施目录。
- 环境耦合风险：当前未发现硬编码本地绝对路径或模型目录；现有脚本主要依赖仓库相对路径和既定目录结构。

## 认证与授权

- 认证方式：当前未发现 `auth`、`login`、`token`、`jwt`、`oauth` 等认证实现；该仓库现状无法确认存在应用层认证逻辑。
- Token 生命周期：当前未配置
- 权限模型：当前未配置

## 安全变更规则

1. 涉及认证、权限、密钥的改动必须在 PR 中标注 `security-impact`。
2. 任何敏感值只允许通过环境注入，不得硬编码。
3. 发现泄漏后先轮转密钥，再修代码与文档。
