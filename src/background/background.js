// 当插件图标被点击时，发送消息给当前活动的选项卡
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      console.log('Message sent: toggleSidebar');
    }
  });
});
// console.log('success!!!!!');
// 监听来自 contentScript.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background: ", message.text); // 记录收到的消息

  if (message.action === 'fillTextBox') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      console.log("Executing script to fill text box on tab:", tabs[0].id); // 检查是否找到了活动标签页
      
      
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: fillSidebarTextBox,
        args: [message.text] // 传递选中的文本
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError.message);
        } else {
          console.log("Text passed to sidebar: ", message.text); // 记录传递给侧边栏的文本
        }

        // 确保返回响应，防止 message port 关闭
        sendResponse({ status: 'success' });
      });
    });
    return true;
  }
});

function fillSidebarTextBox(selectedText) {
  console.log("Filling text box with: ", selectedText); // 打印调试信息
  const chatInput = document.querySelector('#chat-input');  // 寻找侧边栏中的textarea

  if (chatInput) {
    console.log("Text box found. Filling with selected text:", selectedText); // 如果找到元素，打印日志
    chatInput.value = selectedText;  // 填充选中的文本
  } else {
    console.error("Chat input text area not found!");  // 如果没找到文本框，打印错误信息
  }
}


