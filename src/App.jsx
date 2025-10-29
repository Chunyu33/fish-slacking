import React, { useEffect, useState } from "react";
import Header from "./components/Header";

const App = () => {
  const [autoHide, setAutoHide] = useState(true);

  // 从主进程获取 autoHide 状态
  useEffect(() => {
    window.electronAPI?.getAutoHide?.().then((enabled) => {
      setAutoHide(enabled);
    });
  }, []);

  // 当 autoHide 改变时，通知主进程
  useEffect(() => {
    window.electronAPI?.setAutoHide?.(autoHide);
  }, [autoHide]);

  return (
    <div className="app-container">
      <Header />
      {/* ✅ 这里可以自由放页面内容 */}
      {/* <iframe
        src="https://www.bing.com"
        title="Bing"
        style={{
          border: "none",
          width: "100%",
          height: "calc(100vh - 35px)",
        }}
      /> */}
    </div>
  );
};

export default App;
