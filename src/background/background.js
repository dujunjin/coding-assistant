chrome.runtime.onInstalled.addListener(() => {
  // 设置侧边栏行为为点击扩展图标时打开侧边栏
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// 监听浏览器图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 发送消息到当前激活的标签页，通知 contentScript.js 切换侧边栏的显示状态
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
  // 切换侧边栏显示状态
  chrome.sidePanel.open({ windowId: tab.windowId }).catch((err) => {
    console.error('Error opening side panel:', err);
  });
});

// 根据特定条件在特定网站启用侧边栏
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.startsWith("http://ojo.bnu.edu.cn")) {
    // 当页面加载完成时，启用侧边栏
    chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  } else {
    // 对其他页面禁用侧边栏
    chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

// 获取页面Cookies
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      console.log('Cookies for current page:', cookies);
    });
  }
});
