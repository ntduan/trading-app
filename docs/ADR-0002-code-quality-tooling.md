# ADR-0002：统一代码检查与格式化工具链

## 决策

为了保证代码风格一致、提交代码前避免低级错误，并提升开发体验，项目采用了以下代码质量工具链：

- 使用 `eslint-plugin-prettier` 插件，将 Prettier 的规则集成到 ESLint 中，实现统一格式化。
- 配置 VS Code 默认格式化方式为 ESLint 插件。
- 配置 Husky，在 `pre-commit` 阶段运行 `eslint --fix`，自动修复部分代码风格问题。
- 配置 GitHub Actions，在 CI 阶段自动运行 `lint`, `type-check` 和 `test` 命令。

---

## 实施细节

### 1. 格式化与 Lint 统一

集成 `eslint-plugin-prettier` 插件，使 Prettier 的格式检查直接在 ESLint 中完成。开发阶段仅需执行：
`eslint --fix` 即可完成代码规范检查和格式自动修复。
### 2. VS Code 编辑器配置
在 .vscode/settings.json 中设置类似这的配置：
```
"[typescript]": {
  "editor.defaultFormatter": "dbaeumer.vscode-eslint"
}
```
确保 VS Code 使用 ESLint 插件进行格式化。

### 3. 提交前检查

使用 Husky 添加 pre-commit 钩子，自动运行 `eslint --fix` 避免不规范代码被提交。

### 4. GitHub Actions 检查流程

在 CI 阶段自动运行以下命令：`pnpm lint`, `pnpm types-check`, `pnpm test`, 确保所有提交经过类型检查和测试验证。

