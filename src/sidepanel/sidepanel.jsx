// SidePanel.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
// import { chrome } from 'browser';

const SidePanel = () => {
  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    // 读取初始值
    chrome.storage.local.get(['codeText'], (result) => {
      if (result.codeText) {
        setCodeText(result.codeText);
      }
    });

    // 监听存储变化
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (changes.codeText) {
        setCodeText(changes.codeText.newValue);
      }
    });

    // 清理监听器
    return () => {
      chrome.storage.onChanged.removeListener((changes, areaName) => {
        if (changes.codeText) {
          setCodeText(changes.codeText.newValue);
        }
      });
    };
  }, []);

  return <Sidebar codeText={codeText} />;
};

export default SidePanel;

import {createRoot} from "react-dom/client";
const container = document.getElementById('root');
const root =createRoot(container);
root.render(<SidePanel />)

// ReactDOM.render(<SidePanel />, document.getElementById('root'));
