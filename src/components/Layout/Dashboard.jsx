import './Dashboard.css';
import '../Widgets/WidgetContainer'
import '../Widgets/WeatherWidget/WeatherWidget'
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import QuotesWidget from '../Widgets/QuotesWidget/QuotesWidget';
import CurrencyWidget from '../Widgets/CurrencyWidget/CurrencyWidget'
import { createSwapy, utils} from 'swapy'
import { useEffect, useRef } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';

const Dashboard = () => {
  const swapyRef = useRef(null)
  const containerRef = useRef(null)  

  useEffect(() =>{
    swapyRef.current = createSwapy(containerRef.current, {
      // manualSwap: true,
      enabled: true,
      animation: 'spring',
      swapMode: 'hover',
      autoScrollOnDrag: true
      // тут настройки свапи
    })
    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  return (
    <div className="dashboard">
      {/* Шапка дашборда */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1><AiOutlineDashboard />Мой Дашборд</h1>
          <span className="dashboard-subtitle">
            {new Date().toLocaleDateString('ru-RU')}
          </span>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Добавить виджет
          </button>
          <button className="btn btn-secondary">
            Сохранить макет
          </button>
        </div>
      </header>
      {/* сами виджеты */}
      <div className='widgets' ref={containerRef}>
        <div className='widgets-grid'>
          <div className="slot" data-swapy-slot='1'>
            <div className="slot-container" data-swapy-item='1'><WeatherWidget /></div>
          </div>
          <div className="slot" data-swapy-slot='2'>
            <div className="slot-container" data-swapy-item='2'><QuotesWidget /></div>
          </div>
          <div className="slot" data-swapy-slot='3'>
            <div className="slot-container" data-swapy-item='3'><CurrencyWidget /></div>
          </div>
        </div>
        </div>
    </div>
  ) 
};

export default Dashboard