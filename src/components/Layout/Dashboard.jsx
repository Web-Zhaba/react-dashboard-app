import './Dashboard.css';
// import '../Widgets/WidgetContainer'
// import '../Widgets/WeatherWidget/WeatherWidget'
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import QuotesWidget from '../Widgets/QuotesWidget/QuotesWidget';
import CurrencyWidget from '../Widgets/CurrencyWidget/CurrencyWidget'
import { useEffect, useState, useCallback } from 'react';
import { MdDashboard } from "react-icons/md";
import MainModal from '../UI/Modal/MainModal';
import { MdDateRange } from "react-icons/md";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);

  // Функция добавления виджета (всё гуд)
  const handleAddWidget = (widgetType) => {
    const newWidgetId = Date.now(); // Генерируем уникальный ID
    
    const newWidget = {
      widgetId: newWidgetId,
      widgetType: widgetType,
      data: {},
      config: {}
    };
    
    setWidgets(prev => [...prev, newWidget]);
  };

  // Функция удаления виджета
  const handleRemoveWidget = useCallback((widgetId) => {
    setWidgets(prev => prev.filter(w => w.widgetId !== widgetId));
  }, []);

  // Рендеринг виджета по типу
  const renderWidget = useCallback((widget) => {
    const commonProps = {
      widgetId: widget.widgetId,
      data: widget.data || {},
      config: widget.config || {},
      onRemove: () => handleRemoveWidget(widget.widgetId),
    };

    switch (widget.widgetType) {
      case 'weather':
        return <WeatherWidget key={widget.widgetId} {...commonProps} />;
      case 'quotes':
        return <QuotesWidget key={widget.widgetId} {...commonProps} />;
      case 'currency':
        return <CurrencyWidget key={widget.widgetId} {...commonProps} />;
      default:
        return null;
    }
  }, [handleRemoveWidget]);

  return (
    <div className="dashboard">
      {/* Шапка дашборда */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1><MdDashboard />Мой Дашборд</h1>
          <span className="dashboard-subtitle">
            <span><MdDateRange />
            {new Date().toLocaleDateString('ru-RU')} &nbsp;
            {widgets.length} виджетов загружено</span>
          </span>
        </div>
        <div className="header-right">
          <MainModal className="btn btn-primary" onAddWidget={handleAddWidget} />
          <button className="btn btn-secondary">
            Сохранить макет
          </button>
        </div>
      </header>

      {/* сами виджеты */}
      <div className='widgets'>
        <div className='widgets-grid'>
          {widgets.length === 0 ? (
            <div className="empty-state">
              <p>Нет виджетов. Добавьте виджет, нажав кнопку "Добавить виджет"</p>
            </div>
          ) : (
            widgets.map((widget) => (
              <div 
                className="widget-container" 
                key={widget.widgetId}
              >
                {renderWidget(widget)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard