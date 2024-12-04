import React, { useContext, useEffect } from 'react';
import { showIcon } from '../utils/iconManager';
// import { chrome } from 'browser';

const App = () => {
  // 鼠标事件监听器：文本选择时显示图标
  useEffect(() => {
    const mouseUpListener = (e) => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        chrome.storage.local.set({ codeText: selectedText });
        showIcon(e.pageX, e.pageY, selectedText);
      }
    };
    document.addEventListener('mouseup', mouseUpListener);
    return () => {
      document.removeEventListener('mouseup', mouseUpListener);
    };
  });

  // 交叉观察器：当代码块进入视野时显示图标
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const codeBlock = entry.target;
          const rect = codeBlock.getBoundingClientRect();
          const x = window.scrollX + rect.right + 5;
          const y = window.scrollY + rect.top + 100;
          const text = codeBlock.textContent.trim();
          chrome.storage.local.set({ codeText: text });
          showIcon(x, y, text);
          observer.unobserve(codeBlock);
        }
      });
    },{ threshold: 0.1 });

    document.querySelectorAll('pre, code, .example_code').forEach((block) => {
      observer.observe(block);
    });

    return () => {
      observer.disconnect();
    };
  });

  return (
    <>
      {/* App 组件内容 */}
    </>
  );
};

export default App;

import {createRoot} from "react-dom/client";
const mountNode = document.createElement('div');
document.body.appendChild(mountNode);
const root = createRoot(mountNode);
root.render(<App />);



