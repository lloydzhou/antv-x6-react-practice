import * as X6 from '@antv/x6';
import React, { createRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';
const GraphContext = /*#__PURE__*/createContext();
export const Graph = /*#__PURE__*/forwardRef((props, ref) => {
  const [graph, setGraph] = useState(null);
  const realRef = ref || /*#__PURE__*/createRef();
  const {
    container,
    children,
    className = 'react-x6-graph',
    ...other
  } = props;
  const containerRef = /*#__PURE__*/createRef(container);
  useEffect(() => {
    if (containerRef.current && !realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other
      });
      setGraph(realRef.current = graph);
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(GraphContext.Provider, {
    value: graph
  }, containerRef.current ? null : /*#__PURE__*/React.createElement("div", {
    ref: containerRef
  }), !!graph && children));
});
export const useGraphInstance = () => useContext(GraphContext);