# x6 react 最佳实践
<a href="https://www.npmjs.com/package/react-x6-graph"><img alt="NPM Package" src="https://img.shields.io/npm/v/react-x6-graph.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/react-x6-graph"><img alt="NPM Size" src="https://img.shields.io/bundlephobia/minzip/react-x6-graph"></a>
<a href="https://www.npmjs.com/package/react-x6-graph"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/react-x6-graph?logo=npm&style=flat-square"></a>
<a href="/LICENSE"><img src="https://img.shields.io/github/license/lloydzhou/antv-x6-react-practice?style=flat-square" alt="MIT License"></a>

提供一个react下使用X6的最佳范本：
1. 简单易用，易于做逻辑拆分
2. 体积小(gzip压缩后仅0.5k)
3. 支持多实例
4. 支持使用ref绑定x6 graph

## 安装
```
npm install react-x6-graph
yarn add react-x6-graph
```

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

2. 使用
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
  const gRef = useRef()
  useEffect(() => {
    // TODO 这里使用父组件的ref方便将gRef传递到与Graph以外的组件使用
    console.log('ref', gRef)
  }, [gRef.current])
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

