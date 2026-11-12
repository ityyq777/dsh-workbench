# 个人工作台 · DSH 插件

个人工作台是 DeepSeek Harness（DSH）的本地优先工作台，由五个可独立安装的插件组成：

| 包 | 作用 |
| --- | --- |
| `dsh-workbench-host` | 共享宿主：本地 SQLite、业务域注册、HTTP/SSE、`Workbench` agent 工具、账号与数据同步、按模块导出/导入、卡片首页 |
| `dsh-workbench-tasks` | 任务与任务树（9 个视图、时间线、重启、批量归并/迁表） |
| `dsh-workbench-tags` | 标签管理，供站点等业务归类 |
| `dsh-workbench-sites` | 站点收藏：目录树、多链接、标签与筛选 |
| `dsh-workbench-storage` | 储物：名称、品牌、单位、库存文本与标签的本地台账 |

任务、标签、站点、储物都会把 `dsh-workbench-host` 声明为依赖：安装任意业务插件时，
DSH 会一并准备宿主。数据保存在 `~/.dsh/workbench/workbench.db`，卸载插件只删代码，
不删数据。

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

从插件市场或 DSH 设置 → 插件安装；命令行：

```sh
dsh plugin --profile web add dsh-workbench-host
dsh plugin --profile web add dsh-workbench-tasks
dsh plugin --profile web add dsh-workbench-tags
dsh plugin --profile web add dsh-workbench-sites
# storage 首次发布前可用本地源码包安装（先 pnpm build）
dsh plugin --profile web add file:$PWD/packages/addons/storage
```

只装需要的业务插件即可。安装/升级/卸载后按 DSH 提示重启或刷新。

也可以从发布镜像查看各包 README：

- 发布镜像：https://github.com/ityyq777/dsh-workbench
- 包目录：[`packages/host`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/host)、[`packages/tasks`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/tasks)、[`packages/tags`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/tags)、[`packages/sites`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/sites)

> 发布镜像由源码主仓库的 `scripts/stage-release.mjs` 生成，五个目录分别是可发布的 npm 包。
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
