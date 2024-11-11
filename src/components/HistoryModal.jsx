// HistoryModal.jsx

import React from 'react';
import { loadHistory, clearHistory } from '../services/historyService'; // 确保引用正确

const HistoryModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // 如果不可见，返回 null，不渲染组件

  const history = loadHistory(); // 加载历史记录

  return (
    <div className="history-modal">
      <button className="close-button" onClick={onClose}>关闭</button>
      <h2>历史记录</h2>
      {history.length > 0 ? (
        history.map((item, idx) => (
          <div key={idx} className="history-item">
            <strong>{item.role}:</strong> {item.content}
            <span className="timestamp">{item.timestamp}</span>
          </div>
        ))
      ) : (
        <p>暂无历史记录</p>
      )}
      <button onClick={clearHistory}>清除历史记录</button>
    </div>
  );
};

export default HistoryModal;
