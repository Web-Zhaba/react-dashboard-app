import { useState, useEffect } from 'react';
import { fetchWeather } from '../../../services/api/WeatherAPI';
import WidgetContainer from '../WidgetContainer';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadWeather = async () => {
    try {
      setLoading(true);
      const data = await fetchWeather();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadWeather();
  }, []);
  
  return (
    <WidgetContainer 
      title="Погода" 
      loading={loading} 
      error={error}
    >
      {weather && (
        <div className="weather-content">
          <div className="weather-main">
            <img 
              src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.description}
            />
            <div className="weather-temp">
              <span className="temp-current">{weather.temp}°C</span><br></br>
              <span className="temp-feels">
                Ощущается как {weather.feelsLike}°C
              </span>
            </div>
          </div>
          <p className="weather-desc">{weather.description}</p>
          <p className="weather-city">{weather.city}</p>
        </div>
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget