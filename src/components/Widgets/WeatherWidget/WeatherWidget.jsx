import { useState, useEffect } from 'react';
import { fetchWeather } from '../../../services/api/WeatherAPI';
import WidgetContainer from '../WidgetContainer';
import './weather.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

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
  
  const handleRefresh = () => {
    loadWeather();
  };

  return (
    <WidgetContainer 
      title="Погода" 
      loading={loading} 
      error={error}
      onRefresh={handleRefresh}
    >
      {weather && (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-header">
              <p className="weather-city">{weather.city}</p>
              <span className='upper-section'>
                <p className="temp-current">{weather.temp}°C</p>
                <p className='weather-desc'>{weather.description}<br></br>
                  <FaArrowDown color='lightblue' />{weather.tempMin}° <FaArrowUp color='red' />{weather.tempMax}°
                </p>
              </span>
            </div>
            <img 
              src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.description}
            />
            <div className="weather-grid">
              <div className='circle'>
                <div className="circle-container">
                  <div className='temp-feels'>Ощущается как</div>
                  <div className='temp-feels-temp'>{weather.feelsLike}°C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget