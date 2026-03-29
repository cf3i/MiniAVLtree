# Security

> 本文档回答：什么不能碰？什么要小心？

## 敏感信息清单

当前仓库根目录未发现 `.gitignore`，因此敏感文件排除规则当前未配置。仓库内未发现 `.env.example` 或其他环境变量样例文件，代码中也未检索到 `process.env`、`os.environ`、`os.Getenv`、`getenv` 等环境变量读取语句。

| 类型 | 示例 | 存储方式 | 禁止行为 |
| --- | --- | --- | --- |
| 当前未发现已声明的敏感环境变量 | `（待填写）` | 当前未配置 `.env.example`、Secret Manager 映射或 CI Secrets 引用 | 后续新增密钥、令牌、凭据时不得硬编码到源码、脚本或文档中 |

## 受保护路径

- `scripts/build_context.py`：Workflow Template 上下文装配脚本，内置了 `docs/stage.lock`、`docs/workflow/`、`docs/plan/current.md`、`docs/plan/archive/` 等关键路径约定，不应被 agent 随意修改。
- `scripts/run_issue_tests.sh`：回归测试入口脚本，影响 `issue_test/` 下所有脚本的执行范围与失败策略。
- `docs/stage.lock`：虽本次未读取，但从脚本依赖关系可确认它是 workflow 入口状态文件，应视为受保护路径。
- `docs/workflow/`：Stage 指令文件目录，由 `scripts/build_context.py` 直接依赖，应避免非必要改动。
- `docs/plan/current.md`、`docs/plan/archive/`：Workflow 计划态文件，属于流程状态与归档数据，不应在无明确目的时改写。
- `issue_test/*.sh`：回归脚本会被统一执行，修改会直接影响质量门结果。
- `.github/workflows/`、`infra/`、`secrets/`：当前仓库未发现这些路径，相关 CI、部署与密钥目录当前未配置。

## 认证与授权

- 认证方式：当前在仓库代码与脚本中未发现 `auth`、`login`、`token`、`jwt`、`oauth`、`session` 等认证实现；（待填写）
- Token 生命周期：当前未配置
- 权限模型：当前未配置

## 安全变更规则

1. 涉及认证、权限、密钥的改动必须在 PR 中标注 `security-impact`。
2. 任何敏感值只允许通过环境注入，不得硬编码。
3. 发现泄漏后先轮转密钥，再修代码与文档。
