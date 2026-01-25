import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import useInput from '../../../hooks/useInput'
import { fetchWeather, clearWeatherCache } from '../../../services/api/WeatherAPI';
import WidgetContainer from '../WidgetContainer';
import { FaArrowDown, FaArrowUp, FaRegEye, FaSearchLocation  } from 'react-icons/fa';
import { WiHumidity, WiBarometer, WiWindy } from "react-icons/wi";

const WeatherWidget = memo(({ widgetId, onRemove }) => {
  const input = useInput('Москва')
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadWeather = useCallback(async () => {
    try {
      console.log(input.value)
      setLoading(true);
      const data = await fetchWeather(input.value);
      setWeather(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки погоды');
      console.error('Ошибка загрузки погоды:', err);
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    loadWeather();
    // Автообновление каждые 20 минут
    const intervalId = setInterval(loadWeather, 20 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [loadWeather]);

  const handleRefresh = useCallback(() => {
    clearWeatherCache();
    loadWeather();
  }, [loadWeather]);

  const weatherDetails = useMemo(() => {
    if (!weather) return null;
    return {
      tempString: `${weather.temp}°C`,
      feelsLikeString: `${weather.feelsLike}°C`,
      iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
    };
  }, [weather]);

  return (
    <WidgetContainer 
      title="Погода" 
      loading={loading} 
      error={error}
      onRefresh={handleRefresh}
      widgetType="weather"
      widgetId={widgetId}
      onRemove={onRemove}
    >
      {weather && weatherDetails && (
        <div className="weather-content">
          <div className="flex justify-center items-center mb-3">
            <input 
              placeholder='Введите город' 
              type="text" 
              className="rounded-xl placeholder:text-sub-text-dark placeholder:text-sm sm:placeholder:text-lg text-center text-lg sm:text-2xl w-full max-w-xs focus:outline-2 focus:-outline-offset-2 focus:outline-accent-dark p-2" 
              {...input}
            />
            <button 
              onClick={handleRefresh} 
              className="ml-2 p-2 hover:scale-110 duration-200"
              aria-label="Поиск погоды"
            >
              <FaSearchLocation className='w-5 h-5 sm:w-6 sm:h-6' />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
            <p className="text-4xl sm:text-5xl lg:text-6xl order-2 sm:order-1">{weatherDetails.tempString}</p>
            <div className='text-center sm:text-left order-1 sm:order-2 mb-3 sm:mb-0'>
              <div className='first-letter:uppercase text-lg sm:text-lg'>
                {weather.description}
              </div>
              <span className='flex justify-center sm:justify-start items-center text-sm sm:text-base'>
                <FaArrowDown className='text-cyan-400 mr-1' /> 
                {weather.tempMin}° &nbsp;
                <FaArrowUp className='text-red-600 mr-1' /> 
                {weather.tempMax}°
              </span>
            </div>
          </div>
          <img
            className='block mx-auto scale-100 sm:scale-125 lg:scale-150 my-4' 
            src={weatherDetails.iconUrl} 
            alt={weather.description}
            loading="lazy"
          />
          <div className="bg-white rounded-full p-4 mb-6 mt-7">
            <div className="text-gray-600 text-sm text-center">Ощущается как</div>
            <div className="text-2xl font-bold text-gray-800 text-center">{weatherDetails.feelsLikeString}</div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiWindy 
              size={22}
              className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.windSpeed} м/с</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiHumidity
              size={22} 
              className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.humidity}%</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiBarometer 
              size={22} 
              className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.pressure} мбар</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <FaRegEye 
              size={20} 
              className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.visibility} км</div>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
});

WeatherWidget.displayName = 'WeatherWidget';
export default WeatherWidget;