import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../components/Sidebar';  // 导入你之前创建的Sidebar组件

const SidePanel = () => {
  return <Sidebar />;
};

import {createRoot} from "react-dom/client";
const container = document.getElementById('root');
const root =createRoot(container);
root.render(<SidePanel />)

// ReactDOM.render(<SidePanel />, document.getElementById('root'));
