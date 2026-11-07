# 个人工作台 · DSH 插件

个人工作台是 DeepSeek Harness（DSH）的本地优先工作台，由四个可独立安装的插件组成：

| 包 | 作用 |
| --- | --- |
| `dsh-workbench-host` | 共享宿主：本地 SQLite、业务域注册、HTTP/SSE、`Workbench` agent 工具、账号与数据同步、按模块导出/导入、卡片首页 |
| `dsh-workbench-tasks` | 任务与任务树（9 个视图、时间线、重启、批量归并/迁表） |
| `dsh-workbench-tags` | 标签管理，供站点等业务归类 |
| `dsh-workbench-sites` | 站点收藏：目录树、多链接、标签与筛选 |

任务、标签、站点都会把 `dsh-workbench-host` 声明为依赖：安装任意业务插件时，
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

## 安装

从插件市场或 DSH 设置 → 插件安装；命令行：

```sh
dsh plugin --profile web add dsh-workbench-host
dsh plugin --profile web add dsh-workbench-tasks
dsh plugin --profile web add dsh-workbench-tags
dsh plugin --profile web add dsh-workbench-sites
```

只装需要的业务插件即可。安装/升级/卸载后按 DSH 提示重启或刷新。

也可以从发布镜像查看各包 README：

- 发布镜像：https://github.com/ityyq777/dsh-workbench
- 包目录：[`packages/host`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/host)、[`packages/tasks`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/tasks)、[`packages/tags`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/tags)、[`packages/sites`](https://github.com/ityyq777/dsh-workbench/tree/main/packages/sites)

> 发布镜像由源码主仓库的 `scripts/stage-release.mjs` 生成，四个目录分别是可发布的 npm 包。
> 修改代码请回 [源码主仓库](https://github.com/ityyq777/dsh-workbench-source)，不要直接编辑生成出来的文件。

## 数据与隐私

- 业务数据默认只在本机 SQLite；
- 登录云端账号后才按行同步，冲突按 LWW 处理；
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

## 许可

MIT · Copyright (c) 2026 ityq777
