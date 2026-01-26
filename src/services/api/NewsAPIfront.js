const NEWS_API_KEY = '51f130461f55455591598e3ddb185531';

const cache = {
  // Структура: { 'general': { data: {...}, timestamp: 123 }, 'sports': {...} }
};

const CACHE_DURATION = 60 * 60 * 1000; // 60 минут

export const fetchNews = async (category = 'general') => {
  const now = Date.now();
  
  // Проверка кэша для конкретной категории
  if (cache[category] && cache[category].timestamp && 
      (now - cache[category].timestamp) < CACHE_DURATION) {
    console.log(`Возвращаем кэшированные новости для категории: ${category}`);
    return cache[category].data;
  }
  
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=30&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      if (cache[category] && cache[category].data) {
        console.log(`Ошибка запроса, возвращаем старые данные для ${category}`);
        return cache[category].data;
      }
      throw new Error(`Ошибка загрузки новостей (${response.status})`);
    }

    const data = await response.json();

    const newsData = {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      category: category,
      timestamp: now
    };

    // Сохранение в кэш для этой категории
    cache[category] = {
      data: newsData,
      timestamp: now
    };
    
    console.log(`Загружены свежие новости для категории: ${category}`);
    return newsData;
  } catch (error) {
    console.error(`Ошибка при получении новостей для ${category}:`, error);

    // Пробуем вернуть старые кэшированные данные
    if (cache[category] && cache[category].data) {
      console.log(`Возвращаем кэшированные данные из-за ошибки для ${category}`);
      return cache[category].data;
    }
    
    // Если совсем нет данных, пробуем загрузить общие новости
    if (category !== 'general') {
      console.log(`Пробуем загрузить общие новости вместо ${category}`);
      return fetchNews('general');
    }
    
    throw error;
  }
};

// Очистка кэша для конкретной категории или всего
export const clearNewsCache = (category = null) => {
  if (category) {
    delete cache[category];
    console.log(`Кэш очищен для категории: ${category}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log('Весь кэш новостей очищен');
  }
};

export const getNewsCategories = () => {
  return [
    { id: 'general', name: 'Общие', icon: '📰' },
    { id: 'business', name: 'Бизнес', icon: '💼' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎭' },
    { id: 'health', name: 'Здоровье', icon: '🏥' },
    { id: 'science', name: 'Наука', icon: '🔬' },
    { id: 'sports', name: 'Спорт', icon: '⚽' },
    { id: 'technology', name: 'Технологии', icon: '💻' },
  ];
};