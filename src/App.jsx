import React, { useEffect, useRef } from 'react';
import Header from './components/Header';

const App = () => {
  const hideTimer = useRef(null);

  useEffect(() => {
    const handleMouseLeave = () => {
      hideTimer.current = setTimeout(() => {
        window.electronAPI?.hideWindow?.(0);
      }, 2000); // 鼠标离开 2s 后隐藏
    };

    const handleMouseEnter = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      window.electronAPI?.showWindow?.();
    };

    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <iframe
        src="https://www.bing.com"
        title="Bing"
        style={{
          border: 'none',
          width: '100%',
          height: 'calc(100vh - 55px)',
        }}
      />
    </div>
  );
};

export default App;
