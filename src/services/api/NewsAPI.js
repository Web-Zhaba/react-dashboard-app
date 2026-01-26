// Базовый URL вашего бэкенда
const BACKEND_URL = 'http://localhost:3001';

// Кэш на фронтенде
const cache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 60 минут

export const fetchNews = async (category = 'general') => {
  const now = Date.now();
  
  // Проверка кэша на фронтенде
  if (cache[category] && cache[category].timestamp && 
      (now - cache[category].timestamp) < CACHE_DURATION) {
    console.log(`Frontend cache hit for category: ${category}`);
    return cache[category].data;
  }
  
  try {
    // Если категория 'general', используем базовый URL, иначе с категорией
    const url = category === 'general' 
      ? `${BACKEND_URL}/api/news`
      : `${BACKEND_URL}/api/news/${category}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Сохраняем в кэш фронтенда
    cache[category] = {
      data: data,
      timestamp: now
    };
    
    console.log(`Fetched news from backend for category: ${category}`);
    return data;
    
  } catch (error) {
    console.error(`Error fetching news from backend for ${category}:`, error);
    
    // Пробуем вернуть кэшированные данные
    if (cache[category] && cache[category].data) {
      console.log('Returning frontend cached data');
      return cache[category].data;
    }
    
    throw error;
  }
};

// Очистка кэша
export const clearNewsCache = (category = null) => {
  if (category) {
    delete cache[category];
    // Очищаем кэш на бэкенде
    fetch(`${BACKEND_URL}/api/news/cache/${category}`, {
      method: 'DELETE'
    }).catch(err => console.error('Error clearing backend cache:', err));
    
    console.log(`Frontend cache cleared for category: ${category}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    // Очищаем весь кэш на бэкенде
    fetch(`${BACKEND_URL}/api/news/cache`, {
      method: 'DELETE'
    }).catch(err => console.error('Error clearing backend cache:', err));
    
    console.log('All frontend news cache cleared');
  }
};

// Получение категорий с бэкенда
export const getNewsCategories = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/news-categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching categories from backend:', error);
    
    // Возвращаем дефолтные категории при ошибке
    return [
      { id: 'general', name: 'Общие', icon: 'newspaper' },
      { id: 'business', name: 'Бизнес', icon: 'business_center' },
      { id: 'entertainment', name: 'Развлечения', icon: 'comedy_mask' },
      { id: 'health', name: 'Здоровье', icon: 'health_cross' },
      { id: 'science', name: 'Наука', icon: 'science' },
      { id: 'sports', name: 'Спорт', icon: 'sports' },
      { id: 'technology', name: 'Технологии', icon: 'desktop_windows' },
    ];
  };
};