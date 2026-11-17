# dsh-workbench-vault

个人工作台凭据保险箱：加密保存密码与 token，agent 只见掩码

## 安装

```sh
dsh plugin --profile web add dsh-workbench-vault
```

安装或升级后按 DSH 提示重启/刷新。

密文与 KDF 参数不进备份导出，换机需重新录入或等云同步。

## 兼容性

- DSH：`>=0.2.0-rc.1 <0.3.0`
- Node：`>=22.5`

## 仓库

- 源码入口：https://github.com/ityyq777/dsh-workbench
- 问题反馈：https://github.com/ityyq777/dsh-workbench/issues

## 许可

MIT
