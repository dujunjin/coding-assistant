import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../components/Sidebar';
import FavoritesPage from '../components/FavoritesPage'; // 引入收藏夹页面
import { showIcon, removeIcon } from '../utils/iconManager';

const App = () => {
  const [selectedText, setSelectedText] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isFavoritesVisible, setFavoritesVisible] = useState(false); // 新增状态：控制收藏夹显示
  
  // 监听文本选择并显示侧边栏
  const displaySidebarWithText = (text) => {
    setSelectedText(text);
    setSidebarVisible(true);
  };

  // 显示收藏夹
  const openFavoritesPage = () => {
    setFavoritesVisible(true);  // 隐藏收藏夹页面
  };
  
  // 返回侧边栏
  const goBackToSidebar = () => {
    setFavoritesVisible(false);  // 隐藏收藏夹页面
  };

  // 鼠标事件监听器：文本选择时显示图标
  useEffect(() => {
    const mouseUpListener = (e) => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText && !isSidebarVisible) {
        showIcon(e.pageX, e.pageY, () => displaySidebarWithText(selectedText));
      }
    };
    document.addEventListener('mouseup', mouseUpListener);
    // 清理事件监听
    return () => {
      document.removeEventListener('mouseup', mouseUpListener);
    };
  }, [isSidebarVisible]);

  // 交叉观察器：当代码块进入视野时显示图标
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isSidebarVisible) {
          const codeBlock = entry.target;
          const rect = codeBlock.getBoundingClientRect();
          const x = window.scrollX + rect.right - 100;
          const y = window.scrollY + rect.top;
          showIcon(x, y, () => displaySidebarWithText(codeBlock.textContent.trim()));
          observer.unobserve(codeBlock);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('pre, code, .example_code').forEach((block) => {
      observer.observe(block);
    });

    return () => {
      observer.disconnect();
    };
  }, [isSidebarVisible]);

  // 监听 Chrome 扩展消息以切换侧边栏可见性
  useEffect(() => {
    const messageListener = (message) => {
      if (message.action === 'toggleSidebar') {
        setSelectedText('');
        setSidebarVisible(!isSidebarVisible);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [isSidebarVisible]);

  // 创建容器并渲染 Sidebar
  const renderSidebar = () => {
    // 检查页面中是否已经存在 Sidebar
    const existingSidebar = document.querySelector('#sidebar-container');
    if (existingSidebar) return; // 如果已存在 Sidebar，则不再重新渲染
    console.log("restart");

    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'sidebar-container';
    document.body.appendChild(sidebarContainer);
    ReactDOM.render(
      <Sidebar
        selectedText={selectedText}
        onClose={() => {
          setSidebarVisible(false);
          removeIcon();
          sidebarContainer.remove(); // 关闭时移除容器
        }}
        onOpenFavorites={openFavoritesPage} // 传递打开收藏夹的回调
      />,
      sidebarContainer
    );
  };

  return (
    <>
      {isSidebarVisible && renderSidebar()}
      {isFavoritesVisible && (<FavoritesPage onBack={goBackToSidebar}/>)} {/* 显示收藏夹页面 */}
      {/* 你可以在这里渲染其他的页面内容 */}
    </>
  );
};

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);
ReactDOM.render(<App />, mountNode);


