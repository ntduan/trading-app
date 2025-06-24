# ADR-0002：状态管理工具

## 背景

项目需要管理多个共享状态，包括：

- 当前选中的交易对
- 交易对元数据（通过请求获取）
- 用户挂单、表单配置
- 本地持久化设置（localStorage）
- 实时流数据及其依赖组合

官方建议状态管理方案包括 Redux Toolkit、Recoil 和 Zustand。我们结合实际需求和开发体验做出了最终选择。

## 决策

选择 **Jotai** 作为主要状态管理工具。

## 原因与对比

- **Redux Toolkit**：功能完善但引入繁琐，对于现代 React 项目而言有更简洁的替代方案。
- **Zustand**：轻量、集中式状态管理库，适合替代 React Context，但不是原子化模型，组合和依赖管理上不够灵活。
- **Recoil**：理念与 Jotai 类似，但目前已不再维护，生态停滞。
- **Jotai（✅最终选择）**：原子化模型天然契合 React 的声明式思维，状态组合、派生灵活；生态中已有丰富插件。

此外，项目中还使用了 **React Query** 管理远程请求和缓存，本身也具有一定的状态管理能力，与 Jotai 搭配使用也非常适合。

## 实践方式

### 状态组织

- 所有共享状态集中放在 `state/atoms` 目录。
- 需要同步到 localStorage 的状态，通过 `atomWithStorage` 包装。
- 请求类状态使用 `atomWithQuery` 将 Jotai 与 React Query 结合。

例如，获取交易对列表的定义如下：

    export const allTradingPairsAtom = atomWithQuery(() => ({
      queryKey: [QUERY_KEYS.TRADING_PAIR],
      queryFn: fetchTradingPairs,
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }));

使用方式如下：

    const { data: tradingPairs, isLoading } = useAtomValue(allTradingPairsAtom);

然后通过派生 atom 获取当前选中交易对的详细信息：

    export const activeTradingPairInfoAtom = atom((get) => {
      const symbol = get(activeTradingPairSymbolAtom);
      const allPairs = get(allTradingPairsAtom);

      if (allPairs.status === 'success' && allPairs.data) {
        return allPairs.data.find((pair) => pair.symbol === symbol) || null;
      }

      return null;
    });

使用方式如下：

    const pairInfo = useAtomValue(activeTradingPairInfoAtom);

该状态只会在依赖变更时更新，具备良好的性能表现。
