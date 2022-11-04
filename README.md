# x6 react 最佳实践

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
