// 监听浏览器状态栏图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 发送消息到当前激活的标签页，通知 contentScript.js 切换侧边栏的显示状态
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
});

