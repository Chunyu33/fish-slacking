import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SettingMenu from "./components/SettingMenu";

const App = () => {
  const [showSettings, setShowSettings] = useState(false);

  // 初始化时从 store 获取自动隐藏状态
  useEffect(() => {
    window.electronAPI?.getAutoHide?.().then((enabled) => {
      console.log("AutoHide initial:", enabled);
    });
  }, []);

  // 全局快捷键 Alt+F 在主进程已注册，这里不需要
  // 这里只管理设置菜单展示和页面嵌入 iframe

  return (
    <div className="app-container">
      <Header onOpenSettings={() => setShowSettings(true)} />
      {showSettings && (
        <SettingMenu onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default App;
