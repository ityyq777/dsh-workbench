# dsh-workbench-host

个人工作台宿主：本地 SQLite、业务域注册、HTTP/SSE、Workbench agent 工具、账号与数据同步。

## 安装

```sh
dsh plugin --profile web add dsh-workbench-host
```

安装或升级后按 DSH 提示重启/刷新。

宿主本身不提供任务/标签/站点/物品视图；安装任一业务插件即可使用。业务插件会自动依赖本包。

## 兼容性

- DSH：`>=0.2.0-rc.1 <0.3.0`
- Node：`>=22.5`

## 仓库

- 源码入口：https://github.com/ityyq777/dsh-workbench
- 问题反馈：https://github.com/ityyq777/dsh-workbench/issues

## 许可

MIT
