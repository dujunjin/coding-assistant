// src/services/favoriteService.js

// 保存收藏
export const saveFavorite = (message) => {
  // 检查消息是否为空
  if (!message || message.trim() === '') {
    return;  // 如果为空，直接返回
  }
  // 获取现有收藏夹
  const existingFavorites = getFavorites();
  
  // 确保消息不会重复收藏
  if (!existingFavorites.some(fav => fav.content === message)) {
    // 为新消息生成唯一的 id
    const newFavorite = {
      content: message,
      id: Date.now()  // 使用当前时间戳生成唯一 id
    };

    // 将新消息添加到现有收藏夹
    existingFavorites.push(newFavorite);
    
    // 保存更新后的收藏夹到 localStorage
    localStorage.setItem('favorites', JSON.stringify(existingFavorites));

    // 更新组件的状态，触发页面重新渲染
  }
};

  
// 删除收藏
export const removeFavorite = (id) => {
  const existingFavorites = getFavorites();
  const updatedFavorites = existingFavorites.filter(item => item.id !== id);

  // 保存删除后的收藏夹到 localStorage
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

};

  
  // 获取所有收藏
  export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }
  
  // 清空所有收藏
  export function clearFavorites() {
    localStorage.removeItem('favorites');
  }
  