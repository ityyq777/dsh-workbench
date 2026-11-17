# dsh-workbench-automation

个人工作台自动化：定时/域事件/手动触发白名单 action，含模板、条件、限频与运行记录

## 安装

```sh
dsh plugin --profile web add dsh-workbench-automation
```

安装或升级后按 DSH 提示重启/刷新。

定时规则由插件内 30 秒定时器驱动，不依赖宿主调度器。

## 兼容性

- DSH：`>=0.2.0-rc.1 <0.3.0`
- Node：`>=22.5`

## 仓库

- 源码入口：https://github.com/ityyq777/dsh-workbench
- 问题反馈：https://github.com/ityyq777/dsh-workbench/issues

## 许可

MIT
