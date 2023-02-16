// @ts-nocheck
import React, { useEffect, useState, createRef, useRef, useContext, forwardRef } from "react";
import { useGraphInstance } from './lib/Graph'

const defaultStyle = {
  width: "120px",
  boxShadow: "0 4px 12px rgb(0 0 0 / 15%)"
};

const ContextMenuContext = React.createContext();

export const ContextMenu = forwardRef((props, ref) => {
  const graph = useGraphInstance();
  const realRef = ref || createRef()
  const { bindType='node', bindEvent='contextmenu', style = {}, children } = props;

  const container = createRef()

  const [context, setContext] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    view: null,
  });

  const handleShow = ({ e, x, y }) => {
    e.preventDefault();
    e.stopPropagation();
    // 将画布本地坐标转换为画布坐标
    const { x: px, y: py } = graph.localToGraph(x, y);
    let view = null;
    let item = null;
    if (bindType === "node" || bindType === "edge") {
      const views = graph.findViewsFromPoint(x, y).filter((v) => {
        if (bindType === "edge") {
          // @ts-ignore
          return !!v.targetView;
        }
        // @ts-ignore
        return !v.targetView;
      });
      if (views.length) {
        // @ts-ignore
        const v = views
          .sort((a, b) => a.cell.getZIndex() < b.cell.getZIndex())
          .pop();
        view = v;
        item = v?.cell;
      }
    }
    setContext({
      ...context,
      visible: true,
      x: px,
      y: py,
      view,
      item
    });
  };
  const handleClose = () => {
    setContext({
      ...context,
      visible: false,
      x: 0,
      y: 0,
      view: null,
      item: null
    });
  };

  useEffect(() => {
    if (realRef.current) {
      realRef.current.context = context
    }
  }, [context])

  useEffect(() => {

    realRef.current = { context, onShow: handleShow, onClose: handleClose }

    graph.on(`${bindType}:${bindEvent}`, handleShow);
    if (!(bindType === "blank" && bindEvent === "click")) {
      graph.on("blank:click", handleClose);
    }
    graph.on("blank:mousedown", handleClose);
    graph.on("blank:mousewheel", handleClose);

    return () => {
      graph.off(`${bindType}:${bindEvent}`, handleShow);
      graph.off("blank:click", handleClose);
      graph.off("blank:mousedown", handleClose);
      graph.off("blank:mousewheel", handleClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bindEvent, bindType]);

  const { visible, x, y, item } = context;
  const positionStyle = {
    position: "absolute",
    left: x + "px",
    top: y + "px",
    display: visible ? 'block' : 'none',
  };
  const id = item ? item.id : "";
  return (
    <ContextMenuContext.Provider value={{ ...context, onClose: handleClose}}>
      <div
        ref={container}
        className="x6-widget-contextmenu"
        // @ts-ignore
        style={{ ...defaultStyle, ...style, ...positionStyle }}
        // key={id}
        onClick={(e) => handleClose()}
      >
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
});

export const useContextMenuContext = () => useContext(ContextMenuContext)
export default ContextMenu;

