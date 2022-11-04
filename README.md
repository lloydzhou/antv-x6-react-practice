# x6 react 最佳实践

1. 定义画布组件
```
// 使用GraphContext存储实际的x6 graph对象

const GraphContext = createContext()

// 导出一个Graph组件，支持父组件传递ref拿到graph对象
export const Graph = forwardRef((props, ref) => {

  const realRef = ref || createRef()

  const { container, children, ...other } = props
  // 如果传递了container，就使用传进来的container初始化画布
  // 否则组件自己渲染一个div来初始化画布
  const containerRef = createRef(container)

  useEffect(() => {
    if (!realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      })
      realRef.current = graph
    }
  })

  return (
    <GraphContext.Provider value={realRef}>
      {containerRef.current ? null : <div ref={containerRef} />}
      {children}
    </GraphContext.Provider>
  )
})

// 导出一个帮助函数以便Graph组件的子组件获取x6 graph对象
export const useGraphInstance = () => useContext(GraphContext)
```

2. 使用
```
import { Graph, useGraphInstance } from './Graph'

const GraphBehavior = () => {
  const graph = useGraphInstance()
  // TODO 这里拿到graph对象处理自己的逻辑（例如使用后端数据初始化画布，增加事件监听...）
  return null
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

