import React, { useState, useEffect } from "react";
import "./css/setting.css";

const SettingMenu = ({ onClose }) => {
  const [autoHide, setAutoHide] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [scale, setScale] = useState(1.0);

  // 打开设置时从主进程获取最新自动隐藏状态
  useEffect(() => {
    window.electronAPI.getAutoHide().then((enabled) => setAutoHide(enabled));
  }, []);

  const handleAutoHide = (e) => {
    const isChecked = e.target.checked;
    setAutoHide(isChecked);
    window.electronAPI?.setAutoHide?.(isChecked);
  };

  const handleOpacity = (e) => {
    const val = parseFloat(e.target.value);
    setOpacity(val);
    window.electronAPI?.setOpacity?.(val);
  };

  const handleScale = (e) => {
    const val = parseFloat(e.target.value);
    setScale(val);
    window.electronAPI?.setZoom?.(val);
  };

  return (
    <div className="setting-menu" onMouseLeave={onClose}>
      <div className="setting-row">
        <label>
          <input type="checkbox" checked={autoHide} onChange={handleAutoHide} />
          自动隐藏
        </label>
      </div>
      <div className="setting-row">
        <label>透明度</label>
        <input
          type="range"
          min="0.4"
          max="1"
          step="0.01"
          value={opacity}
          onChange={handleOpacity}
        />
      </div>
      <div className="setting-row">
        <label>网页缩放</label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={scale}
          onChange={handleScale}
        />
      </div>
    </div>
  );
};

export default SettingMenu;
