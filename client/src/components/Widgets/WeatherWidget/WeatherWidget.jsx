import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import useInput from '../../../hooks/useInput';
import { fetchWeather, clearWeatherCache } from '../../../services/api/WeatherAPI';
import WidgetContainer from '../WidgetContainer';
import { FaArrowDown, FaArrowUp, FaRegEye, FaSearchLocation } from 'react-icons/fa';
import { WiHumidity, WiBarometer, WiWindy } from 'react-icons/wi';

const WeatherWidget = memo(({ widgetId, onRemove }) => {
  const {
    value: cityInput,
    onChange,
    submittedValue,
    isValid,
    submit,
    touched
  } = useInput('Москва', { minLength: 2 });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (city) => {
    if (!city || city.trim() === '') return;
    try {
      setLoading(true);
      const data = await fetchWeather(city);
      setWeather(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки погоды');
    } finally {
      setLoading(false);
    }
  }, []);

  // Эффект для загрузки при изменении города 
  useEffect(() => {
    loadWeather(submittedValue);
  }, [submittedValue, loadWeather]);

  // Автообновление каждые 20 минут
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadWeather(submittedValue);
    }, 20 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [submittedValue, loadWeather]);

  // Обработчик ручного обновления (сброс кеша + поиск)
  const handleRefresh = useCallback(() => {
    clearWeatherCache();
    submit(); 
  }, [submit]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      submit();
    }
  };

  // Мемоизация данных для рендера
  const weatherDetails = useMemo(() => {
    if (!weather) return null;
    return {
      tempString: `${weather.temp}°C`,
      feelsLikeString: `${weather.feelsLike}°C`,
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
        {/* Поле ввода */}
          <div className="w-full mb-4">
            <div className="flex gap-2">
              <input
                placeholder="Введите город"
                type="text"
                value={cityInput}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                className={`grow p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  touched && !isValid
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-accent-dark focus:ring-accent-dark'
                }`}
              />
              <button
                onClick={handleRefresh} 
                disabled={!isValid}
                className="px-4 py-2 bg-accent-dark text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Поиск погоды"
              >
                <FaSearchLocation className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Поиск</span>
              </button>
            </div>
            {/* Отображение ошибки валидации */}
            {!isValid && (
              <p className="text-sm text-red-500 mt-1">Минимум 2 символа</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
            <p className="text-4xl sm:text-5xl lg:text-6xl order-2 sm:order-1">
              {weatherDetails.tempString}
            </p>
            <div className="text-center sm:text-left order-1 sm:order-2 mb-3 sm:mb-0">
              <div className="first-letter:uppercase text-lg sm:text-lg">
                {weather.description}
              </div>
              <span className="flex justify-center sm:justify-start items-center text-sm sm:text-base">
                <FaArrowDown className="text-cyan-400 mr-1" />
                {weather.tempMin}° &nbsp;
                <FaArrowUp className="text-red-600 mr-1" />
                {weather.tempMax}°
              </span>
            </div>
          </div>

          <img
            className="block mx-auto my-4 w-40 drop-shadow-2xl"
            src={`./icons/${weather.icon}.svg`}
            alt={weather.description}
            loading="lazy"
          />

          <div className="bg-white rounded-full p-4 mb-6 mt-7">
            <div className="text-gray-600 text-sm text-center">Ощущается как</div>
            <div className="text-2xl font-bold text-gray-800 text-center">
              {weatherDetails.feelsLikeString}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiWindy size={22} className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.windSpeed} м/с</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiHumidity size={22} className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.humidity}%</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <WiBarometer size={22} className="text-blue-300 mx-auto mb-1" />
              <div className="text-white text-sm text-center">{weather.pressure} мбар</div>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg hover:scale-110 duration-200">
              <FaRegEye size={20} className="text-blue-300 mx-auto mb-1" />
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