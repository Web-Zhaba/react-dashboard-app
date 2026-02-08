import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { fetchNews, clearNewsCache, getNewsCategories } from '../../../services/api/NewsAPI'
import WidgetContainer from '../WidgetContainer';
import { FaExternalLinkAlt, FaNewspaper } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import './NewsWidget.css'

const NewsWidget = memo(({ widgetId, onRemove }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const categories = useMemo(() => getNewsCategories(), []);

  const loadNews = useCallback(async (category = selectedCategory) => {
    try {
      setLoading(true);
      const data = await fetchNews(category);
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки новостей');
      console.error('Ошибка загрузки новостей:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadNews();
    const intervalId = setInterval(loadNews, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [loadNews]);

  const handleRefresh = useCallback(() => {
    clearNewsCache(selectedCategory);
    loadNews();
  }, [loadNews, selectedCategory]);

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
    setVisibleCount(2);
    clearNewsCache(categoryId);
    loadNews(categoryId);
  }, [loadNews]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 2);
  };

  const handleShowLess = () => {
    setVisibleCount(2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} ч. назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Общие';
  };

  return (
    <WidgetContainer
      title={'Новости'}
      loading={loading} 
      error={error}
      onRefresh={handleRefresh}
      onSettings={() => setShowCategoryDropdown(!showCategoryDropdown)}
      widgetType="news"
      widgetId={widgetId}
      onRemove={onRemove}
    >
      {showCategoryDropdown && (
        <div 
          className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
          style={{
            right: '8px',
            top: '45px' 
          }}
        >
          <div className="scroll p-2 max-h-60 overflow-y-auto">
            <div className="text-xs text-sub-text-dark mb-2 px-2">Выберите категорию:</div>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-accent-dark text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="grow">{category.name}</span>
                  {selectedCategory === category.id && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {news && news.articles && (
        <div className="news-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Статистика */}
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-800/30 rounded-lg shrink-0">
            <div className="flex items-center text-sub-text-dark text-sm">
              <FaNewspaper className="mr-2" />
              <span>Найдено: {news.totalResults || news.articles.length} новостей</span>
            </div>
            <div className="text-xs text-sub-text-dark">
              Категория: <span className="text-accent-dark">{getCategoryName(selectedCategory)}</span>
            </div>
          </div>

          {/* Список новостей с прокруткой */}
          <div className="scroll flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {news.articles.length === 0 ? (
              <div className="text-center py-8 text-sub-text-dark">
                <FaNewspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Нет новостей в этой категории</p>
                <button
                  onClick={() => handleCategoryChange('general')}
                  className="mt-3 bg-accent-dark text-white hover:bg-opacity-80 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Показать общие новости
                </button>
              </div>
            ) : (
              <div className="space-y-3 pr-2">
                {news.articles.slice(0, visibleCount).map((article, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800/60 rounded-xl p-3 hover:bg-gray-800/60 transition-all duration-200 border-l-4 border-accent-dark"
                  >
                    {/* Заголовок и дата */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white text-sm sm:text-base line-clamp-2 grow">
                        {truncateText(article.title, 60)}
                      </h3>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent-dark hover:text-white ml-2 shrink-0"
                        title="Открыть новость"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Описание */}
                    {article.description && (
                      <p className="text-sub-text-dark text-xs sm:text-sm mb-3 line-clamp-2">
                        {truncateText(article.description, 120)}
                      </p>
                    )}

                    {/* Источник и время */}
                    <div className="flex justify-between items-center text-xs text-sub-text-dark">
                      <div className="flex items-center">
                        {article.source?.name && (
                          <>
                            <FaNewspaper className="mr-1" />
                            <span className="truncate max-w-25 sm:max-w-37.5">
                              {article.source.name}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <MdAccessTime className="mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Изображение */}
                    {article.urlToImage && (
                      <div className="mt-3 overflow-hidden rounded-lg">
                        <img 
                          src={article.urlToImage} 
                          alt={article.title} 
                          className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки "Показать еще"/"Свернуть" */}
          {news.articles.length > 2 && (
            <div className="text-center pt-2 border-t border-gray-700/50 mt-2">
              {visibleCount < news.articles.length ? (
                <button
                  onClick={handleShowMore}
                  className="bg-accent-dark text-white hover:bg-opacity-90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  Показать еще ({news.articles.length - visibleCount})
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="bg-gray-700 text-white hover:bg-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  Свернуть
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </WidgetContainer>
  );
});

NewsWidget.displayName = 'NewsWidget';
export default NewsWidget;