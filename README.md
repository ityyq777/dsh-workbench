# 个人工作台 · DSH 插件

个人工作台是 DeepSeek Harness（DSH）的本地优先工作台，由四个可独立安装的插件组成：

| 包 | 作用 |
| --- | --- |
| `dsh-workbench-host` | 共享宿主：本地 SQLite、业务域注册、HTTP/SSE、`Workbench` agent 工具、账号与数据同步、卡片首页 |
| `dsh-workbench-tasks` | 任务与任务树（9 个视图、时间线、重启、批量归并/迁表） |
| `dsh-workbench-tags` | 标签管理，供站点等业务归类 |
| `dsh-workbench-sites` | 站点收藏：目录树、多链接、标签与筛选 |

任务、标签、站点都会把 `dsh-workbench-host` 声明为依赖：安装任意业务插件时，
DSH 会一并准备宿主。数据保存在 `~/.dsh/workbench/workbench.db`，卸载插件只删代码，
不删数据。

## 安装

从插件市场或 DSH 设置 → 插件安装；命令行：

```sh
dsh plugin --profile web add dsh-workbench-host
dsh plugin --profile web add dsh-workbench-tasks
dsh plugin --profile web add dsh-workbench-tags
dsh plugin --profile web add dsh-workbench-sites
```

只装需要的业务插件即可。安装/升级/卸载后按 DSH 提示重启或刷新。

也可以直接从本仓库安装：

```sh
dsh plugin --profile web add github:ityyq777/dsh-workbench#path:/packages/host
dsh plugin --profile web add github:ityyq777/dsh-workbench#path:/packages/tasks
```

> 本仓库由主仓库的 `scripts/stage-release.mjs` 生成，四个目录分别是可安装的 npm 包。
> 修改代码请回主仓库，不要直接编辑这里生成的文件。

## 数据与隐私

- 业务数据默认只在本机 SQLite；
- 登录云端账号后才按行同步，冲突按 LWW 处理；
- 不包含遥测，不上传插件清单或使用记录；
- `Workbench` 工具与 UI 共享同一份本地权威数据库。

## 开发

主仓库使用 pnpm monorepo：

```sh
pnpm install
pnpm build && node scripts/dist-shell.mjs
pnpm test:e2e
```

## 许可

MIT · Copyright (c) 2026 ityq777
