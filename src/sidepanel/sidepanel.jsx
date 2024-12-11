import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../components/Sidebar';  // 导入你之前创建的Sidebar组件

const SidePanel = () => {
  return <Sidebar />;
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SidePanel />);