const url = 'https://api.api-ninjas.com/v2/randomquotes'

const cache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 20 * 60 * 1000, // 20 минут в миллисекундах
};
export const fetchQuotes = async () => {
  const now = Date.now();
  if (cache.data && cache.timestamp && 
      (now - cache.timestamp) < cache.CACHE_DURATION) {
    console.log('Возвращаем данные по цитатам из кеша');
    return cache.data;
  }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'X-Api-Key': 'Axy3pXKaBjg5tgyg1BlYBrahAZFFViITaOJVan1s',
                }
            }
        );

        if (!response.ok) {
        // Возврат данных из кеша при ошибке
        if (cache.data) {
            console.log('Ошибка запроса, возвращаем кешированные данные');
            return cache.data;
        }
        throw new Error('Ошибка запроса цитат');
        }

        const data = await response.json();

        const quotesData = {
            quote: data[0].quote,
            author: data[0].author,
            category: data[0].categories,
            timestamp: now,
        }
        // Сохранение в кеш
        cache.data = quotesData;
        cache.timestamp = now;
        
        console.log('Получены свежие данные цитат из API');
        console.log(data)
        return quotesData;
    } catch (error) {
        console.error('Ошибка при получении цитат:', error);

        if (cache.data) {
        console.log('Возвращаем кешированные цитаты из-за ошибки');
        return cache.data;
        }
        throw error;
    }
};

// сброс кеша
export const clearQuotesCache = () => {
  cache.data = null;
  cache.timestamp = null;
};