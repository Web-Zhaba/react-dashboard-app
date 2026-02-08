const API_BASE_URL = 'https://react-dashboard-app-omega.vercel.app';

const cache = {
  // Структура: { 'general': { data: {...}, timestamp: 123 }, 'sports': {...} }
};
const CACHE_DURATION = 60 * 60 * 1000; // 60 минут

export const fetchNews = async (category = 'general') => {
  const now = Date.now();
  
  // Проверка кэша на фронтенде
  if (cache[category] && cache[category].timestamp && (now - cache[category].timestamp) < CACHE_DURATION) {
    console.log(`Найден кеш для категории: ${category}`);
    return cache[category].data;
  }
  
  try {
    // Всегда используем URL с категорией (даже для general)
    const url = `${API_BASE_URL}/api/news/${category}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ошибка бекэнда: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Сохраняем в кэш фронтенда
    cache[category] = {
      data: data,
      timestamp: now
    };
    
    console.log(`Запрошены новости с бекэнда по категории: ${category}`);
    return data;
    
  } catch (error) {
    console.error(`Ошибка запроса с бекэнда по категории ${category}:`, error);
    
    // Пробуем вернуть кэшированные данные
    if (cache[category] && cache[category].data) {
      console.log('Возврат данных из кеша');
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
    fetch(`${API_BASE_URL}/api/news/cache/${category}`, {
      method: 'DELETE'
    }).catch(err => console.error('Ошибка очистки кеша на бекэнде:', err));
    
    console.log(`Кеш очищен для категории: ${category}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    // Очищаем весь кэш на бэкенде
    fetch(`${API_BASE_URL}/api/news/cache`, {
      method: 'DELETE'
    }).catch(err => console.error('Ошибка очистки кеша на бекэнде:', err));
    
    console.log('Весь кеш новостей очищен');
  }
};

// Получение категорий (статические)
export const getNewsCategories = () => {
  return [
    { id: 'general', name: 'Общие'},
    { id: 'business', name: 'Бизнес'},
    { id: 'entertainment', name: 'Развлечения'},
    { id: 'health', name: 'Здоровье'},
    { id: 'science', name: 'Наука'},
    { id: 'sports', name: 'Спорт'},
    { id: 'technology', name: 'Технологии' },
  ];
};
