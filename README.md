# x6 react 最佳实践
<a href="https://www.npmjs.com/package/react-x6-graph"><img alt="NPM Package" src="https://img.shields.io/npm/v/react-x6-graph.svg?style=flat-square"></a>
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-x6-graph?style=flat-square)
![npm](https://img.shields.io/npm/dm/react-x6-graph?style=flat-square)
<a href="/LICENSE"><img src="https://img.shields.io/github/license/lloydzhou/antv-x6-react-practice?style=flat-square" alt="MIT License"></a>

提供一个react下使用X6的最佳范本：
1. 组件  
a. 简单易用，易于做逻辑拆分  
b. 体积小(Graph组件仅40行)  
c. 支持多实例  
d. 支持使用ref绑定x6 graph  
e. 支持使用useGraphInstance获取x6 graph对象

2. hooks  
a. 易学易用  
b. 方便在自己的组件中管理图数据  
c. 自动检测图数据变化，并增量更新到x6画布  
d. hooks内部使用batchUpdate优化性能

## 安装
```
npm install react-x6-graph
yarn add react-x6-graph
```

## 在线demo

[react-x6-graph-demo](https://codesandbox.io/s/antv-x6-react-graph-demo-6ere13?file=/src/App.js)

## 设计
1. 定义画布组件
```
// 使用GraphContext存储实际的x6 graph对象

const GraphContext = createContext()

// 导出一个Graph组件，支持父组件传递ref拿到graph对象
export const Graph = forwardRef((props, ref) => {

  const [graph, setGraph] = useState(null)
  const realRef = ref || createRef()

  const { container, children, ...other } = props
  // 如果传递了container，就使用传进来的container初始化画布
  // 否则组件自己渲染一个div来初始化画布
  const containerRef = createRef(container)

  useEffect(() => {
    if (containerRef.current && !realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      })
      setGraph(realRef.current = graph)
    }
  }, [])

  return (
    <GraphContext.Provider value={graph}>
      {containerRef.current ? null : <div ref={containerRef} />}
      {!!graph && children}
    </GraphContext.Provider>
  )
})

// 导出一个帮助函数以便Graph组件的子组件获取x6 graph对象
export const useGraphInstance = () => useContext(GraphContext)
```

2. 定义hooks
```
export const useGraphState = (initState={}) => {
  const {nodes: n, edges: e} = initState
  const [nodes, _setNodes] = useState(n)
  const [edges, _setEdges] = useState(e)
  const graph = useRef()
  const diffNodes = useMemo(() => diffCells(graph.current, nodes, 'node'), [nodes])
  // 节点变化可能引起边的变化
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [nodes, edges])

  const setGraph = useCallback((g) => g && (graph.current = g), [])
  // 更新state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
  const setNodes = (n) => _setNodes(n.map(checkId))
  const setEdges = (e) => _setEdges(e.map(checkId))

  useEffect(() => setGraph(initState.g), [initState.g, setGraph])

  // 使用patch函数更新数据到x6画布
  useEffect(() => graph.current && patch(graph.current, diffNodes), [diffNodes])
  useEffect(() => graph.current && patch(graph.current, diffEdges), [diffEdges])

  return { nodes, edges, graph, setNodes, setEdges, setGraph }
}
```

3. 使用
```
import { Graph, useGraphInstance } from 'react-x6-graph'

const GraphBehavior = () => {
  const graph = useGraphInstance()
  // TODO 这里拿到graph对象处理自己的逻辑（例如使用后端数据初始化画布，增加事件监听...）
  return null
}

const GraphAddButton = () => {
  const graph = useGraphInstance()
  const [count, setCount] = useState(0)
  const addNode = useCallback(() => {
    // TODO 点击的时候添加节点并计数
  }, [count, graph])
  return <Button type="primary">添加节点: {count}</Button>
}

function App() {
  const { nodes, setNodes, edges, setEdges, graph: gRef } = useGraphState()
  const addNode = useCallback(() => {
    // 直接通过setNodes更新数据，添加节点至画布
    setNodes([...nodes, {x, y, width: 80, height: 40, label}])
  }, [nodes])
  return (
    <div className="App">
      <Graph grid resizing snapline keyboard clipboard width={800} height={600}>
        <GraphBehavior />
        <GraphAddButton />
      </Graph>
      {/* 1. Graph组件支持多实例；2. 父组件传递ref */}
      <Graph grid width={800} height={600} ref={gRef}>
        <GraphAddButton />
      </Graph>
    </div>
  );
}
```


## TODO
- [ ] 使用react自定义组件（默认使用Portal）
- [ ] 用这个封装的Graph实现官方流程图（或者直接实现xflow的流程图）

