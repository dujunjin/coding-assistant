import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import{ marked} from 'marked';  // 引入 marked 用于渲染 Markdown
import '../styles/favoritesPage.css'; // 引入样式文件

const FavoritesPage = ({ onBack }) => {
  const [favorites, setFavorites] = useState([]);  // 在这里声明 favorites 和 setFavorites
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);  // 用于记录展开的项目ID

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();  // 获取收藏数据
        setFavorites(data);  // 更新状态
        setLoading(false);
      } catch (error) {
        setError('无法加载收藏夹内容');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // 切换展开/收起收藏项
  const handleToggleExpand = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  // 删除收藏项
  const handleRemoveFavorite = async (id) => {
    try {
      removeFavorite(id);  // 删除收藏
      setFavorites((prevFavorites) => prevFavorites.filter(item => item.id !== id));  // 更新本地状态，移除已删除的项
    } catch (error) {
      setError('删除收藏失败');
    }
  };

  return (
    <div className="favorites-page">
      <div className="header">
        <h1>收藏夹</h1>
        <button onClick={onBack} className="back-button">关闭</button>
      </div>
      
      {loading && <p className="loading-text">加载中...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && favorites.length === 0 && (
        <p className="empty-message">当前没有收藏任何内容。</p>
      )}
      
      {!loading && favorites.length > 0 && (
        <ul className="favorites-list">
          {favorites.map((item) => (
            <li key={item.id} className="favorite-item">
              <div className="favorite-content-container">
                <p 
                  className={`favorite-content ${expandedItemId === item.id ? 'expanded' : 'collapsed'}`}
                  onClick={() => handleToggleExpand(item.id)} 
                  style={{ cursor: 'pointer' }}
                >
                  {expandedItemId === item.id 
                    ? <div dangerouslySetInnerHTML={{ __html: marked(item.content || ' ') }} /> // 使用 marked 渲染 Markdown
                    : (item.content && item.content.length > 15 ? `${item.content.substring(0, 15)}...` : item.content)
                  }
                </p>
              </div>
              <button onClick={() =>  handleRemoveFavorite(item.id)} className="delete-button">
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
