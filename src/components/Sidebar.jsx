import React, { useState } from 'react';
import { sendMessageToModel } from '../model/modelService';

const Sidebar = () => {
  const [messages, setMessages] = useState([{ sender: '系统', text: '欢迎使用大模型交互工具！' }]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { sender: '用户', text: inputText };
      setMessages([...messages, newMessage]);

      const modelReply = await sendMessageToModel(inputText);
      setMessages([...messages, newMessage, { sender: '模型', text: modelReply }]);
      setInputText('');  // 清空输入框
    }
  };

  return (
    <div className="sidebar-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入消息..."
        />
        <button onClick={handleSendMessage}>发送</button>
      </div>
    </div>
  );
};

export default Sidebar;
