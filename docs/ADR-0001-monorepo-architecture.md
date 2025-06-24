# ADR-0001：采用 Monorepo 架构管理项目

## 决策

项目使用了 TradingView 的图表库，它是通过本地安装的方式引入的。该库是压缩后的静态资源，不需要打包或修改。为了结构清晰，将其单独抽离成一个包更直观。

考虑到后续的扩展性，决定使用 **Monorepo 架构**，并通过 `pnpm workspace` 和 `turbo` 进行统一管理。

## 遇到的问题与解决方案

TradingView 图表库运行时会请求固定路径的静态资源，例如：`http://localhost:3000/charting_library/bundles/3443.5802260e3c522b563151.js`。为了确保这些资源可以被正确加载，需要将图表库的静态文件复制到 `public/charting_library` 目录下。为此，在 `apps/trading-app/package.json` 中添加如下 `postinstall` 脚本：

```json
"postinstall": "rm -rf public/charting_library && cp -R ../../packages/tv-charting-library ./public/charting_library"
```
该命令会在依赖安装完成后自动执行，将 TradingView 的静态资源放入指定目录，满足其运行时加载路径的要求。