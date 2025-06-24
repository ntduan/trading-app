# ADR-0004：采用 Tailwind CSS + shadcn UI 作为样式方案

## 决策

项目采用 **Tailwind CSS v4** 作为主要的样式方案，并配合 **shadcn/ui** 组件库构建 UI。

## 方案优势

### Tailwind CSS 4

- 原子化类名，开发效率高，AI 辅助写法体验好
- 强大的响应式与伪类控制（如 `hover:`、`md:`）
- 配合 CSS 变量易于定制
- 良好的 VSCode 插件生态与预览支持

### shadcn/ui

- 基于 Radix UI 的 **headless 组件库**，组件逻辑与样式完全解耦，便于自定义
- 默认使用 Tailwind 编写样式，与主项目风格一致
- 支持通过 CSS 变量统一控制颜色、字体等主题参数

## 实现说明
- 样式核心通过 CSS 变量驱动（如颜色、字体等），统一定义在 `:root` 和 `.dark` 中。
- shadcn 的组件底层基于这些变量构建，切换主题时只需修改变量。
