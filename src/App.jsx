import React, { useEffect, useState } from "react";
import Header from "./components/Header";

const App = () => {
  const [autoHide, setAutoHide] = useState(true);

  // 获取 autoHide 状态
  useEffect(() => {
    window.electronAPI?.getAutoHide?.().then(setAutoHide);
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      window.electronAPI?.showWindow?.();
    };

    const handleMouseLeave = () => {
      if (autoHide) window.electronAPI?.hideWindow?.(0);
    };

    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [autoHide]);

  return (
    <div className="app-container">
      <Header />
      {/* <iframe
        src="https://www.bing.com"
        title="Bing"
        style={{ border: "none", width: "100%", height: "calc(100vh - 35px)" }}
      /> */}
    </div>
  );
};

export default App;
