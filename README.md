在为版本添加tag时会触发该自动打包

使用如下命令以查看历史tag

```shell
git tag
```

使用如下命令为最新的commit添加tag

```shell
git tag -a v1.0.0 -m "version 1.0.0"
```
其中 -a 为添加tag的命令，v1.0.0为tag的名称，-m为添加tag的说明

可以使用

```shell
git show
```

查看tag的详细信息

可以使用如下两种命令将tag添加到远程仓库

+ ```shell
    git push origin v1.0.0
    ```
+ ```shell
    git push origin --tags
    ```

其中第一种命令只会将指定的tag推送到远程仓库，第二种命令会将本地所有的tag推送到远程仓库
