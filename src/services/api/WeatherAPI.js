const API_KEY = '9044fc0f838639bba5c2a1b28c1257a9'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const cache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 20 * 60 * 1000, // 20 минут в миллисекундах
};

export const fetchWeather = async (city = 'Череповец') => {
  // Проверка кеша
  const now = Date.now();
  if (cache.data && cache.timestamp && 
      (now - cache.timestamp) < cache.CACHE_DURATION) {
    console.log('Возвращаем данные по погоде из кеша');
    return cache.data;
  }
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
        );
        if (!response.ok) {
        // Возврат данных из кеша при ошибке
        if (cache.data) {
            console.log('Ошибка запроса, возвращаем кешированные данные');
            return cache.data;
        }
        throw new Error('Ошибка запроса погоды');
        }
        const data = await response.json();
        console.log(data)
        const visibility = data.visibility / 1000
        const weatherData = {
            temp: Math.round(data.main.temp),
            tempMax: Math.round(data.main.temp_max),
            tempMin: Math.round(data.main.temp_min),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            windDegrees: data.wind.deg,
            visibility: visibility,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            city: data.name,
            type: data.weather[0].main,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            timestamp: now,
        };
        // Сохранение в кеш
        cache.data = weatherData;
        cache.timestamp = now;
        
        console.log('Получены свежие данные погоды из API');
        console.log(weatherData)
        return weatherData;
    } catch (error) {
        console.error('Ошибка при получении погоды:', error);

        if (cache.data) {
        console.log('Возвращаем кешированные данные по погоде из-за ошибки');
        return cache.data;
        }
        throw error;
    }
};
// сброс кеша
export const clearWeatherCache = () => {
  cache.data = null;
  cache.timestamp = null;
};