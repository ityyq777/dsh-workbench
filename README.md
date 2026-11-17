# 个人工作台 · DSH 插件

个人工作台是 DeepSeek Harness（DSH）的本地优先工作台：一个共享宿主加若干可独立安装的业务插件。
当前发布 12 个包（宿主 + 11 个插件）：

| 包 | 作用 |
| --- | --- |
| `dsh-workbench-host` | 共享宿主：本地 SQLite、业务域注册、HTTP/SSE、`Workbench` agent 工具、账号与数据同步、按模块导出/导入、卡片首页 |
| `dsh-workbench-tasks` | 任务与任务树（8 个视图、时间线、重启、批量归并/迁表） |
| `dsh-workbench-tags` | 标签管理，供任务、站点与储物归类 |
| `dsh-workbench-sites` | 站点收藏：目录树、多链接、标签与筛选 |
| `dsh-workbench-storage` | 储物：名称、品牌、位置、单位、库存文本与标签的本地台账 |
| `dsh-workbench-message` | 消息中心：给 agent 与其他插件的统一发送入口，收件箱、未读数与可配置提示音 |
| `dsh-workbench-vault` | 凭据保险箱：scrypt 派生密钥 + AES-256-GCM 加密，agent 只见掩码 |
| `dsh-workbench-connector` | 连接器：RSS/Webhook 来源接入，条目与运行记录 |
| `dsh-workbench-automation` | 自动化：定时、域事件或手动触发白名单 action，含模板、条件、限频与运行记录 |
| `dsh-workbench-contacts` | 联系人：本地通讯录、分组、多值字段与 vCard 导入导出 |
| `dsh-workbench-calendar` | 日历：本地日历、事件、参与人与提醒 |
| `dsh-workbench-mail` | 邮件：IMAP 抓邮件头、SMTP 发纯文本，密码托管在保险箱 |

所有业务插件都声明 `dependencies: { "dsh-workbench-host": "^<宿主版本>" }`：安装任意业务插件时，
DSH 会一并准备宿主。数据保存在 `~/.dsh/workbench/workbench.db`，卸载插件只删代码，不删数据。

## 仓库关系

这个项目有两个 GitHub 仓库，职责不同：

| 仓库 | 角色 | 内容 |
| --- | --- | --- |
| [ityyq777/dsh-workbench-source](https://github.com/ityyq777/dsh-workbench-source) | 源码主仓库 | pnpm monorepo、docs、scripts；所有开发提交进这里 |
| [ityyq777/dsh-workbench](https://github.com/ityyq777/dsh-workbench) | 发布镜像 | 仅由 `pnpm stage:release` 与 `pnpm publish:github -- --publish` 生成的 `dist/release` 产物：可发布包、README/LICENSE、市场 YAML 草稿 |

- 源码主仓库是唯一开发入口；不要在发布镜像里直接改代码，镜像会被下一次发布覆盖。
- 发布镜像供 npm 与 DSH 插件市场读取，包路径为 `packages/<name>`；市场条目指向它。
- 两个仓库历史独立，源码仓库不要向发布镜像推送源码提交。

## 源码开发

源码仓库通过 `cloud/` submodule 引用独立云端仓库，不需要再单独 clone 一份：

```sh
git clone --recurse-submodules https://github.com/ityyq777/dsh-workbench-source.git
cd dsh-workbench-source
pnpm install
```

已经 clone 过但没有拉子模块：

```sh
git submodule update --init --recursive
```

更新并构建云端 Java 服务：

```sh
pnpm cloud:update
pnpm cloud:build
```

子模块提交指针变化时，宿主仓库要单独提交 `cloud` 的 gitlink；云端代码仍在
`dsh-workbench-cloud` 仓库提交、推送和部署。

## 安装

从插件市场或 DSH 设置 → 插件安装；命令行（业务包任选其一即可，宿主会被自动带入，默认装最新版）：

```sh
dsh plugin --profile web add dsh-workbench-tasks
dsh plugin --profile web add dsh-workbench-message
dsh plugin --profile web add dsh-workbench-vault
```

要锁定版本就加 `@版本号`，例如 `dsh-workbench-tasks@5.2.19`；各插件当前版本见
`packages/<插件>/package.json` 或 npm 上的同名包。

- 装任意一个业务包都会自动安装宿主 `dsh-workbench-host`（业务包依赖它），不需要先单独装宿主；
- 也可以在同一个 profile 里装多个业务包，它们共享同一份宿主与同一套数据；
- 宿主版本下限见各包 `wb.addon.minShell`（当前最低 0.5.0，最新插件要求 0.6.7）；想用未发布的本地构建，
  先 `pnpm build && node scripts/dist-shell.mjs`，再
  `dsh plugin --profile web add "file:$PWD/packages/addons/tasks"`。

这些包是**工作台宿主上的功能插件**，不能脱离宿主单独运行；单包安装链路的完整验证过程、
版本下限与已知边界见
[发布与插件市场](docs/specs/14-发布与插件市场.md#71-单包独立安装2026-11-12-实测)。
安装/升级/卸载后按 DSH 提示重启或刷新。

也可以从发布镜像查看各包 README：

- 发布镜像：https://github.com/ityyq777/dsh-workbench
- 包目录：[`packages/`](https://github.com/ityyq777/dsh-workbench/tree/main/packages)，一个目录一个 npm 包

> 发布镜像由源码主仓库的 `scripts/stage-release.mjs` 生成，`packages/` 下的目录都是可发布的 npm 包。
> 修改代码请回 [源码主仓库](https://github.com/ityyq777/dsh-workbench-source)，不要直接编辑生成出来的文件。

## 数据与隐私

- 业务数据默认只在本机 SQLite；
- 登录云端账号后才同步：行级表按 LWW，任务树/站点树整表收敛，冲突保留在本地
  `conflict_shadow` 并可在「账号与同步」里处理；
- 不包含遥测，不上传插件清单或使用记录；
- `Workbench` 工具与 UI 共享同一份本地权威数据库；
- 数据备份按模块导出为 zip，导入只合并不删除，格式版本不兼容时拒绝。

## 开发

源码主仓库使用 pnpm monorepo：

```sh
pnpm install
pnpm build && node scripts/dist-shell.mjs
pnpm test:e2e
```

未使用的 ES import 由 ESLint + `eslint-plugin-unused-imports` 检查，支持 JS/TS 和类型导入：

```sh
pnpm lint                           # 只检查，发现未使用的导入时返回非零退出码
pnpm lint:fix                       # 自动删除未使用的导入
pnpm exec eslint path/to/file.ts --fix # 只清理指定文件
```

检查覆盖手写源码与脚本，排除构建产物、归档和 cloud 子模块。当前仅启用 import
清理规则，不清理 CommonJS `require()` 或普通未使用变量；显式副作用导入会保留。
已有源码中的未使用导入会直接报告，不设历史问题豁免。涉及初始化副作用的模块应明确
使用 `import "./setup.js"`，避免依赖未引用的导入变量来执行初始化。
Prettier 的排版配置使用支持注释的 `.prettierrc.json5`，与 ESLint 分工独立。

## 许可

MIT · Copyright (c) 2026 ityq777
