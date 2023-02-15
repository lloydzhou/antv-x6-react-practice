import { useEffect } from 'react'
import { useGraphInstance } from './lib/index'

const EventBehavior = () => {
  const graph = useGraphInstance();
  // TODO 这里拿到graph对象处理自己的逻辑（例如使用后端数据初始化画布，增加事件监听...）
  useEffect(() => {
    const cb = (name, args) => console.log(name, args);
    const added = cb.bind(null, "cell:added");
    const removed = cb.bind(null, "cell:removed");
    const change = cb.bind(null, "cell:change");
    console.log("graph", graph);
    graph.on("cell:added", added);
    graph.on("cell:removed", removed);
    graph.on("cell:change:*", change);
    // 移除监听
    return () => {
      graph.off("cell:added", added);
      graph.off("cell:removed", removed);
      graph.off("cell:change:*", change);
    };
  }, []);
  return null;
};

export default EventBehavior
