const API_KEY = '9044fc0f838639bba5c2a1b28c1257a9'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const fetchWeather = async (city = 'Moscow') => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
        );

        if (!response.ok) throw new Error('Ошибка запроса');

        const data = await response.json();
        console.log('Полученные данные из API погоды:', data);
        return {
            temp: Math.round(data.main.temp),
            tempMax: Math.round(data.main.temp_max),
            tempMin: Math.round(data.main.temp_min),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            city: data.name,
        }
    } catch (error) {
        throw error;
    }
};