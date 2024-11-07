import React, { useState, useEffect } from 'react';
import { sendMessageToModel } from '../services/modelService';
import '../styles/sidebar.css';

const Sidebar = ({ selectedText, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (selectedText) {
      setInput(selectedText);
    }
  }, [selectedText]);

  // 更新消息列表的回调
  const addMessage = (newMessage) => {
    console.log("New message received:", newMessage);
  
    setMessages((prevMessages) => {
      if (newMessage.role === 'system' && !newMessage.loading && newMessage.content === '') {
        console.log("Removing loading bubble:", newMessage.id);
        return prevMessages.filter((msg) => msg.id !== newMessage.id);
      }
  
      if (newMessage.role === 'model' && newMessage.loading) {
        const lastMessageIndex = prevMessages.length - 1;
        if (prevMessages[lastMessageIndex]?.role === 'model') {
          console.log("Updating existing model message with loading status:", newMessage);
          const updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = { ...newMessage };
          return updatedMessages;
        }
      }

      // 如果是最终更新且 loading 为 false，则更新最后一个 model 消息
      if (newMessage.role === 'model' && !newMessage.loading) {
        const lastMessageIndex = prevMessages.length - 1;
        if (prevMessages[lastMessageIndex]?.role === 'model') {
          const updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = { ...newMessage };
          return updatedMessages;
        }
      }
  
      console.log("Adding new message to the list:", newMessage);
      return [...prevMessages, newMessage];
    });
  };
  
  

  const handleSend = () => {
    if (!input.trim()) return;
    const messageContent = input;
    setInput('');
    sendMessageToModel(messageContent, addMessage, addMessage);
  };

  return (
    <div id="custom-sidebar" className="sidebar-container">
      <div className="sidebar-title-bar">
        <span className="title-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12a10 10 0 1 1-10-10"></path>
          </svg>
        </span>
        <span>oding assistant</span>
        <div className="icon-container">
          <button className="pin-icon" onClick={() => console.log('Pin icon clicked')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_406_221)"><path d="M2.12299 24.0004L8.56699 17.5564L13.467 22.4564L14.527 21.3954C15.5718 20.3422 16.3231 19.0342 16.7064 17.6011C17.0897 16.1679 17.0916 14.6595 16.712 13.2254L20.055 9.87138L20.548 10.3654C20.8806 10.7148 21.3258 10.9357 21.8053 10.9891C22.2847 11.0425 22.7676 10.925 23.169 10.6574C23.4041 10.4894 23.5998 10.2724 23.7426 10.0213C23.8854 9.77018 23.9719 9.49101 23.996 9.20314C24.0202 8.91527 23.9815 8.62559 23.8825 8.35418C23.7836 8.08278 23.6268 7.83614 23.423 7.63138L16.455 0.641378C16.1224 0.291951 15.6772 0.0710828 15.1977 0.0176684C14.7183 -0.0357459 14.2353 0.0817191 13.834 0.349378C13.5989 0.517307 13.4032 0.734353 13.2604 0.985465C13.1176 1.23658 13.0311 1.51575 13.0069 1.80362C12.9828 2.09149 13.0215 2.38117 13.1205 2.65257C13.2194 2.92398 13.3762 3.17061 13.58 3.37538L14.139 3.93538L10.789 7.30038L10.725 7.28038C9.29794 6.91063 7.79918 6.91905 6.37637 7.30483C4.95357 7.6906 3.65582 8.44041 2.61099 9.48038L1.54999 10.5374L6.44999 15.4374L-7.62939e-06 21.8774L2.12299 24.0004ZM9.88399 10.1534L11.617 10.7144L16.257 6.06038L17.934 7.74138L13.3 12.3914L13.825 14.0334C14.176 15.3906 13.9935 16.8307 13.315 18.0574L5.94199 10.6864C7.13991 10.0124 8.55011 9.82173 9.88399 10.1534Z" fill="white"/></g><defs><clipPath id="clip0_406_221"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
          </button>
          <button className="more-icon" onClick={() => console.log('More icon clicked')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_406_170)"><path d="M0 3V11H11V0H3C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3H0ZM3 3H8V8H3V3Z" fill="white"/><path d="M20.9998 0H12.9998V11H23.9998V3C23.9998 2.20435 23.6838 1.44129 23.1212 0.87868C22.5585 0.31607 21.7955 0 20.9998 0V0ZM20.9998 8H15.9998V3H20.9998V8Z" fill="white"/><path d="M0 21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H11V13H0V21ZM3 16H8V21H3V16Z" fill="white"/><path d="M12.9998 24H20.9998C21.7955 24 22.5585 23.6839 23.1212 23.1213C23.6838 22.5587 23.9998 21.7956 23.9998 21V13H12.9998V24ZM15.9998 16H20.9998V21H15.9998V16Z" fill="white"/></g><defs><clipPath id="clip0_406_170"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
          </button>
          <button className="close-icon" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_405_1484)"><path d="M22.5 6H1.5C1.10218 6 0.720644 5.84196 0.43934 5.56066C0.158035 5.27936 0 4.89782 0 4.5C0 4.10218 0.158035 3.72064 0.43934 3.43934C0.720644 3.15804 1.10218 3 1.5 3H22.5C22.8978 3 23.2794 3.15804 23.5607 3.43934C23.842 3.72064 24 4.10218 24 4.5C24 4.89782 23.842 5.27936 23.5607 5.56066C23.2794 5.84196 22.8978 6 22.5 6Z" fill="white"/><path d="M22.4999 10.9996H9.49988C9.10205 10.9996 8.72052 10.8416 8.43922 10.5603C8.15791 10.279 7.99988 9.89746 7.99988 9.49963C7.99988 9.10181 8.15791 8.72028 8.43922 8.43897C8.72052 8.15767 9.10205 7.99963 9.49988 7.99963H22.4999C22.8977 7.99963 23.2792 8.15767 23.5605 8.43897C23.8418 8.72028 23.9998 9.10181 23.9998 9.49963C23.9998 9.89746 23.8418 10.279 23.5605 10.5603C23.2792 10.8416 22.8977 10.9996 22.4999 10.9996Z" fill="white"/><path d="M22.5 21H1.5C1.10218 21 0.720644 20.842 0.43934 20.5607C0.158035 20.2794 0 19.8978 0 19.5C0 19.1022 0.158035 18.7206 0.43934 18.4393C0.720644 18.158 1.10218 18 1.5 18H22.5C22.8978 18 23.2794 18.158 23.5607 18.4393C23.842 18.7206 24 19.1022 24 19.5C24 19.8978 23.842 20.2794 23.5607 20.5607C23.2794 20.842 22.8978 21 22.5 21Z" fill="white"/><path d="M22.4999 16.0004H9.49988C9.10205 16.0004 8.72052 15.8423 8.43922 15.561C8.15791 15.2797 7.99988 14.8982 7.99988 14.5004C7.99988 14.1025 8.15791 13.721 8.43922 13.4397C8.72052 13.1584 9.10205 13.0004 9.49988 13.0004H22.4999C22.8977 13.0004 23.2792 13.1584 23.5605 13.4397C23.8418 13.721 23.9998 14.1025 23.9998 14.5004C23.9998 14.8982 23.8418 15.2797 23.5605 15.561C23.2792 15.8423 22.8977 16.0004 22.4999 16.0004Z" fill="white"/><path d="M1.707 15.7452L4.681 12.7712C4.88508 12.5665 4.99968 12.2892 4.99968 12.0002C4.99968 11.7111 4.88508 11.4339 4.681 11.2292L1.707 8.25519C1.56709 8.11532 1.38883 8.02009 1.19479 7.98156C1.00074 7.94302 0.799624 7.96291 0.616884 8.0387C0.434143 8.1145 0.27799 8.24279 0.168182 8.40735C0.0583736 8.57192 -0.00015534 8.76535 3.09641e-07 8.96319V15.0372C-0.00015534 15.235 0.0583736 15.4285 0.168182 15.593C0.27799 15.7576 0.434143 15.8859 0.616884 15.9617C0.799624 16.0375 1.00074 16.0574 1.19479 16.0188C1.38883 15.9803 1.56709 15.8851 1.707 15.7452Z" fill="white"/></g><defs><clipPath id="clip0_405_1484"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
          </button>
        </div>
      </div>

      <div className="chat-history" id="chat-history">
        {messages.map((msg, idx) => (
          <div key={msg.id || idx} className={`chat-bubble ${msg.role}-bubble`}>
            {msg.role === 'model' ? (
              <span dangerouslySetInnerHTML={{ __html: msg.content }} /> // 渲染 Markdown 内容
            ) : (
              msg.content
            )}
            {msg.loading && <span className="loading-indicator">...</span>}
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button className="send-button" onClick={handleSend}>发送</button>
      </div>
    </div>
  );
};

export default Sidebar;
