// 在文件顶部声明全局变量
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../components/Sidebar';
import { showIcon, removeIcon } from '../utils/iconManager';
import { sendMessageToModel } from '../services/modelService'; // 引入封装好的模型服务函数
import '../styles/sidebar.css';


const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const displaySidebarWithText=(text) => {
    // console.log("success!!!");
    setSelectedText(text);
    setSidebarVisible(true);
  };

  const updateChat = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  const handleError = (errorMessage) => {
    updateChat({
      role: 'error',
      content: errorMessage,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleSendMessage = async (message) => {
    await sendMessageToModel(message, updateChat, handleError);
  };

  document.addEventListener('mouseup', (e) => {
    const selectedText = window.getSelection().toString().trim();
    if (e.target.id === 'custom-selected-icon') {
      // 如果点击的是图标，不清除选中的文本，直接返回
      return;
    }
    if (selectedText && !isSidebarVisible) {
      console.log(selectedText);
      console.log('Displaying icon at:', e.pageX, e.pageY);
      showIcon(e.pageX, e.pageY, () => {
        console.log("Icon clicked, displaying sidebar");
        displaySidebarWithText(selectedText);
      });
    }
  });
  
  

  const observer = new IntersectionObserver(
    (entries) => {
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
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('pre, code, .example_code').forEach((block) => {
    observer.observe(block);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleSidebar') {
      setSelectedText(''); // 清空选中文本
      setSidebarVisible(!isSidebarVisible);
    }
  });

  return (
    <>
      {isSidebarVisible && (
        <Sidebar
          selectedText={selectedText}  // 将 selectedText 传递给 Sidebar
          onClose={() => {
            setSidebarVisible(false);
            removeIcon();
          }}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);
ReactDOM.render(<App />, mountNode);
