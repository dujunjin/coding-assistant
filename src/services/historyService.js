// historyService.js

// 保存消息到历史记录
export function saveHistory(role, content) {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.push({ role, content, timestamp: new Date().toLocaleString() });
  localStorage.setItem('history', JSON.stringify(history));
}

// 加载历史记录
export function loadHistory() {
  return JSON.parse(localStorage.getItem('history')) || [];
}

// 清除历史记录
export function clearHistory() {
  localStorage.removeItem('history');
}
