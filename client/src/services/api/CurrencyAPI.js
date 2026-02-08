const url = 'https://www.cbr-xml-daily.ru/daily_json.js'
const cache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
};

export const fetchCurrency = async () => {
  // Проверка кеша
  const now = Date.now();
  if (cache.data && cache.timestamp && 
      (now - cache.timestamp) < cache.CACHE_DURATION) {
    console.log('Возвращаем данные по валютам из кеша');
    return cache.data;
  }    
    try {
        const response = await fetch(url);
        if (!response.ok) {
        // Возврат данных из кеша при ошибке
        if (cache.data) {
            console.log('Ошибка запроса, возвращаем кешированные данные');
            return cache.data;
        }
        throw new Error('Ошибка запроса валют');
        }
        const data = await response.json();
        const currencyData = {
            usdRate: data.Valute.USD.Value.toFixed(2).replace('.', ','),
            usdPrevious: data.Valute.USD.Previous.toFixed(2).replace('.', ','),
            eurRate: data.Valute.EUR.Value.toFixed(2).replace('.', ','),
            eurPrevious: data.Valute.EUR.Previous.toFixed(2).replace('.', ','),
            cnyRate: data.Valute.CNY.Value.toFixed(2).replace('.', ','),
            cnyPrevious: data.Valute.CNY.Previous.toFixed(2).replace('.', ','),
            inrRate: data.Valute.INR.Value.toFixed(2).replace('.', ','),
            inrPrevious: data.Valute.INR.Previous.toFixed(2).replace('.', ','),
            timestamp: now,
        };
        // Сохранение в кеш
        cache.data = currencyData;
        cache.timestamp = now;
        
        console.log('Получены свежие данные из API');
        console.log(data)
        return currencyData;
    } catch (error) {
        console.error('Ошибка при получении курса валют:', error);

        if (cache.data) {
        console.log('Возвращаем кешированные данные по валютам из-за ошибки');
        return cache.data;
        }
        throw error;
    }
};
// сброс кеша
export const clearCurrencyCache = () => {
  cache.data = null;
  cache.timestamp = null;
};