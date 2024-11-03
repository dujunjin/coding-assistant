import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    chrome.storage.local.get('selectedText', (data) => {
      if (data.selectedText) {
        setInputText(data.selectedText);
      }
    });
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div style={{ height: isFullScreen ? '100vh' : '100%', width: '100%' }}>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        <button onClick={toggleFullScreen}>
          {isFullScreen ? '退出全屏' : '全屏'}
        </button>
      </div>
      <textarea
        style={{ width: '100%', height: 'calc(100% - 40px)' }}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
    </div>
  );
};

export default Popup;
