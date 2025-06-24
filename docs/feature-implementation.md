## 1. Instrument Selector

本项目中的交易对选择器的实现重点在于：

- 通过 **URL 路径参数** 控制当前交易对，例如 `/trade/ETHUSDT`
- 本地缓存最近使用的交易对（localStorage），在访问 `/trade` 时自动重定向到默认交易对
- 所有依赖交易对的组件（如图表、订单簿、PnL）均响应 URL 参数变化实现热更新

### 技术细节与优化点

#### 1.1 URL 路径设计

项目采用了 `Next.js App Router`，使用路径 `/trade/[symbol]` 来表示当前交易对，示例：

- `/trade/ETHUSDT`
- `/trade/BTCUSDT`
- `/trade/SOLUSDT`

而非使用查询参数形式（如 `/trade?pair=ETHUSDT`），主要是出于 **用户体验和 SEO** 方面的考虑。

#### 1.2 避免组件重载的优化

直接从 `/trade/ETHUSDT` 切换到 `/trade/BTCUSDT` 会导致页面重新挂载，不利于性能。

为此，我们将主要组件（图表、订单簿、挂单表等）放置在 `/trade/layout.tsx` 中，这样下面的子路由都会共享layout组件，切换子路由不会引起组件的重新加载。

#### 1.3 本地默认值支持

为了提高用户体验，在用户首次访问 `/trade` 时会：

1. 从 `localStorage` 中读取上次使用的交易对（例如 ETHUSDT）
2. 自动重定向到 `/trade/ETHUSDT`
3. 如果无缓存，则使用系统设定的默认值（如 BTCUSDT）

#### 1.4 静态预渲染支持

项目使用 nextjs 提供的函数 `generateStaticParams` 提前构建出固定的交易对路径，如：

- `/trade/ETHUSDT`
- `/trade/BTCUSDT`
- `/trade/SOLUSDT`

这不仅提升了初次加载速度，也保证了 TradingView 图表等依赖路径的客户端逻辑能够正常运行。

## 2. TradingView Chart

本项目使用本地安装的 TradingView 原版 Charting Library 实现主图集成，支持时间周期切换、历史数据加载、WebSocket 实时更新以及自定义指标。

### 2.1 引入方式

使用原始 TradingView Charting Library，通过解压的方式放在 `packages/tv-charting-library` 包中管理。在 monorepo 中通过 `postinstall` 脚本将其复制到 `apps/trading-app/public/charting_library`，作为静态资源引用，避免参与构建流程。

### 2.2 组件封装

图表逻辑统一封装在 `useTradingViewChart` 中，仅初始化一次图表。切换交易对时，调用 TradingView 提供的 API 进行 symbol 热切换，而不重新销毁图表。

图表加载完成后，通过 `chartWidget.createStudy` 添加了 9-period EMA（指数移动平均线）作为自定义指标。

### 2.3 数据适配层

图表的数据调用统一通过 adapter 层处理。历史 K 线数据通过 REST 接口获取，对应 TradingView 的 `getBars` 方法；实时数据通过 WebSocket 推送，对应 `subscribeBars` 方法。所有数据转换逻辑集中在 adapter 中进行，方便维护和复用。

### 2.4 iframe 安全性处理

TradingView 图表通过 iframe 渲染，但默认创建的 iframe 不带 sandbox。为此使用 MutationObserver 监听 DOM，等待 iframe 出现后，动态添加 `sandbox` 属性，提升安全性。

### 2.5 主题切换处理

图表样式由 `overrides` 和内部的 themed CSS 共同控制。切换 `dark` / `light` 模式时，虽然 TradingView 提供了 `applyOverrides` API，但实测并不生效。最终采用的方案是在切换主题时重新销毁并初始化图表，以确保样式能准确生效。

### 实际遇到的问题与处理

- 图表颜色由多个来源共同控制，主题切换时必须同步更新 overrides 和样式变量，否则会出现图表与背景不一致的情况
- TradingView 的 applyOverrides API 在实际使用中无法更新主题，必须重新加载图表才能正确切换样式

## 3. Live Order Book

订单簿模块用于展示当前交易对的买卖深度数据，具备实时性强、渲染性能高、数据结构清晰的特点。

### 3.1 数据来源与完整性处理

采用 Binance 的 `depth@1000ms` WebSocket 接口接收增量订单数据，同时在订阅前通过 REST API 获取快照。

当发现接收到的增量数据 `u` 与当前最后已知 `lastUpdateId` 不连续时，自动触发重新拉取快照并重建订单簿，确保数据一致性。

所有这类处理逻辑封装在 adapter 的一个订阅函数中，对外提供统一订阅入口，保证每次调用都能获得完整、正确的订单簿数据。

### 3.2 数据处理与计算分离

订单簿数据在主线程中不直接排序和聚合，而是通过 `postMessage` 发送给 Web Worker，由 Worker 线程完成聚合（按 tick size）与排序（top 20），然后将结果回传。

考虑到 Binance 的 WebSocket 本身就是每秒一次（1000ms），所以在发送给 Worker 的数据不做节流，确保每个增量都能及时处理。

### 3.3 UI 层优化与节流

订单簿组件通过自定义 Hook `useOrderbook()` 获取数据，并在其中使用 `requestAnimationFrame` 对状态更新进行节流，避免因数据更新频繁导致不必要的 re-render。

每一行订单簿条目都使用 `React.memo` 包裹，只有 props 改变时才会重新渲染。由于 React 的默认机制是父组件状态变动时子组件也会 re-render，因此通过 memo 显著降低了渲染负担。

同时通过 key 精准控制每一行的复用，确保列表结构稳定、动画流畅。

### 3.4 状态管理与共享机制

为了在不同组件间共享实时订单簿数据，使用 `orderbookAtom` 作为底层数据的全局状态容器。

性能敏感场景下，如挂单价格校验等，不依赖 UI 层的异步渲染，而是直接通过：

    store.get(orderbookAtom)

来获取最新的订单簿快照，避免 React 渲染时机带来的延迟。

### 3.5 页面标题更新

订单簿数据更新时会同步更新标签页title，实现方式为通过 useOrderbook 这个接口获取节流过的orderbook数据，当数据更新时候 document.title。

## 4. Trade Ticket

交易面板用于提交限价买入或卖出订单，支持价格自动填充、Post Only 校验、订单校验、余额更新等完整下单流程。

### 4.1 表单初始化与状态管理

交易表单使用 `react-hook-form` 进行管理，提供价格（price）、数量（size）、方向（side）和 Post Only 开关四个字段。

在交易对切换后，会重新计算当前的 `mid price`（买一卖一平均值），并自动作为默认价格填入表单中。

为了保持输入联动体验，未主动修改价格字段的用户，在切换交易对时会收到新的默认价格。

### 4.2 用户余额管理（模拟）

用户初始余额为本地 mock 数据，存储在 localStorage 中。

由于真实交易系统中余额查询是异步的，因此此项目也使用 `react-query` 模拟异步接口加载用户余额数据，保持逻辑接近实际环境。

每次下单成功后，都会触发以下操作：

- 更新用户余额（扣减买入或卖出数量）
- 向订单列表中追加一条新记录
- 失效相关 `queryKey`（如余额、订单列表）以触发自动 refetch

该逻辑通过 `react-query` 的 `useMutation` 完成，在 mutation 中，通过 `onSuccess` 回调调用 `queryClient.invalidateQueries()`，使用户余额和订单列表对应的 queryKey 失效，从而自动触发数据刷新。

### 4.3 Post Only 校验逻辑

当用户勾选 Post Only 开关后，在表单提交时将执行以下逻辑：

1. 获取当前最新的订单簿数据（直接从 `store.get(orderbookAtom)` 获取）
2. 判断用户下单价格是否会立刻成交
3. 若会立刻成交，则拒绝该订单并提示错误
4. 若不会成交，则正常接受订单，添加至订单列表

该逻辑用于模拟真实交易系统中 “只做 maker 不吃单” 的下单策略。

## 5. Positions & PnL Widget

本模块展示用户当前挂单（未成交订单）及其对应的 mark-to-market 未实现盈亏（Unrealized PnL），并支持撤单操作。

### 5.1 数据来源与存储结构

所有订单和余额数据都存储在浏览器的 localStorage 中，通过 `react-query` 封装异步查询接口，使其具备异步行为和缓存特性。

这样可以模拟真实环境下“加载用户资产和订单”的效果，同时通过 `queryClient.invalidateQueries()` 实现依赖数据的自动刷新。

### 5.2 PnL 计算方式

未实现盈亏基于订单价格与最新中间价之间的差异动态计算，并订阅最新的 orderbook，确保 PnL 实时更新。

### 5.3 撤单与余额更新

用户可点击撤单按钮取消任意挂单：

- 撤单后，自动将冻结的资金（或资产）退回至用户余额
- 调用 `react-query` 的 `mutation` 模拟撤单行为，并在 `onSuccess` 中通过 `invalidateQueries()` 触发余额与订单列表的刷新

## 6. Connectivity Resilience

为了应对网络波动或意外断连，项目在数据接入层实现了健壮的 WebSocket 连接恢复机制，确保实时性和数据完整性。

### 6.1 WebSocket 封装与重连策略

在 adapter 层统一封装 WebSocket 连接逻辑，所有订阅（如 K 线、订单簿）共享该机制。

当连接断开时，自动触发重连，重连策略采用 **exponential backoff**，最大重试次数与最大延迟时间均支持配置，保证在网络不稳定场景下的连接可靠性和恢复能力。

WebSocket 连接恢复后，自动重新订阅所有之前的订阅项（如当前交易对的 kline、depth）。

### 6.2 增量数据的完整性校验

对于订单簿数据（orderbook），由于 WebSocket 接收的是增量消息，需要保证增量的连续性。

当检测到增量数据中 `lastUpdateId` 不连续时，会自动触发 resync 逻辑：

- 停止当前增量消费
- 重新发起 REST API 请求获取订单簿快照
- 与增量补丁重新合并，重新构建当前状态，确保订单簿数据准确无误

### 6.3 K 线数据的断点补偿

K 线数据也通过 WebSocket 推送，但在断线期间可能存在多个周期增量未到达前端。

为此，在订阅 K 线数据时引入了 **deltaQueue**：

- 当连接尚未恢复或图表未 ready 时，所有增量 K 线数据先临时存入 `deltaQueue`
- 一旦图表加载完成并且连接恢复，调用 `flushQueue` 方法将断线期间积压的增量数据按顺序补发给图表组件
- 保证 K 线数据连贯、连续，图表不会出现跳变或缺口

## 7. 技术要求覆盖说明（Technical Requirements Overview）

本项目已在前文各章节中实现并说明了大多数技术要求。以下是各项要求的对应说明简要汇总：

- **Tooling**
  - 使用最新版本 Next.js (App Router) + React TypeScript。
  - 状态管理使用 Jotai，详见 [ADR-0003]。
  - 严格配置 ESLint + Prettier + typescript-eslint，husky pre-commit 详见 [ADR-0004]。

- **Data Layer**
  - 通过 `ExchangeAdapter` 接口封装数据访问，已实现 BinanceAdapter。
  - 订单簿和 PnL 聚合计算已委托给 Web Worker 执行，详见 [3.2](#32-数据处理与计算分离)。

- **Performance**
  - 使用 `requestAnimationFrame` 优化高频渲染，详见第 [3.3](#33-UI-层优化与节流)。
  - 已使用 `React.memo` 优化订单薄，详见第 [3.3](#33-UI-层优化与节流)。
  - Lighthouse 检测已验证首屏渲染性能良好。

- **Accessibility & UX**
  - 对键盘支持良好，select 支持方向键选择。支持 tab 键切换输入框。
  - 使用 next-themes 控制dark和light theme，当next-themes 的theme设置为 system时候即可自动切换主题，也可以通过header上的切换按钮切换dark和light theme。 详见[ADR-0004]。
  - 页面已经做了响应式处理，手机端访问良好。

- **Testing**
  - 使用 Vitest + React Testing Library 编写单元测试，覆盖核心功能。
  - 编写了一个 Playwright E2E 测试用例，验证下单后订单出现在 PnL 表中，测试文件在 automation/tests/e2e 里面。

- **Security**
  - 添加了 CSP meta 标签。
  - TradingView 图表 iframe 自动添加 `sandbox`。
  - 所有用户输入字段已做前端校验。
