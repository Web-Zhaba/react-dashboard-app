import './Dashboard.css';
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import QuotesWidget from '../Widgets/QuotesWidget/QuotesWidget';
import CurrencyWidget from '../Widgets/CurrencyWidget/CurrencyWidget'
import NewsWidget from '../Widgets/NewsWidget/NewsWidget';
import ToDoWidget from '../Widgets/ToDoWidget/ToDoWidget';
import { useState, useCallback } from 'react';
import { MdDashboard } from "react-icons/md";
import MainModal from '../UI/Modal/MainModal';
import { MdDateRange, MdSave } from "react-icons/md";

const WIDGETS_STORAGE_KEY = 'dashboard-widgets';

const Dashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    try {
      const stored = localStorage.getItem(WIDGETS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Ошибка загрузки виджетов из localStorage:', error);
      return [];
    }
  });

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

  // Функция сохранения макета (списка и порядка расположения виджетов)
  const saveLayout = useCallback(() => {
    try {
      localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
      console.log('Макет сохранен:', widgets);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  }, [widgets]); 

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
      case 'news':
        return <NewsWidget key={widget.widgetId} {...commonProps} />
      case 'todo':
        return <ToDoWidget key={widget.widgetId} {...commonProps} />
      default:
        return null;
    }
  }, [handleRemoveWidget]);

  return (
    <div className="p-3 sm:p-4 md:p-5 max-h-full m-0 mx-auto">
      {/* Шапка дашборда */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 bg-secondary-dark text-white rounded-lg sm:rounded-xl shadow-2xs gap-3 sm:gap-0">
        <div className="w-full sm:w-auto">
          <h1 className="m-0 text-white flex items-center text-xl sm:text-2xl md:text-3xl"><MdDashboard className="mr-2" />Мой Дашборд</h1>
          <span className="flex text-sub-text-dark text-xs sm:text-sm mt-1">
            <span className='flex items-center'><MdDateRange className="mr-1" />
            {new Date().toLocaleDateString('ru-RU')} &nbsp;
            {widgets.length} виджетов загружено</span>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <MainModal 
          className="cursor-pointer bg-accent-dark text-white hover:-translate-y-0.5 hover:shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 rounded-md text-sm font-medium py-2 px-3 sm:py-2.5 sm:px-4 w-full sm:w-auto duration-200 text-xs sm:text-sm" 
          onAddWidget={handleAddWidget} 
          />
          <button
          onClick={saveLayout}
          className="cursor-pointer bg-white text-black hover:bg-gray-300 hover:-translate-y-0.5 hover:shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 rounded-md text-sm font-medium py-2 px-3 sm:py-2.5 sm:px-4 w-full sm:w-auto duration-200 text-xs sm:text-sm"
          >
            <MdSave className='text-base sm:text-lg' />Сохранить макет
          </button>
        </div>
      </header>

      {/* сами виджеты */}
      <div className='widgets mt-3 sm:mt-4'>
        <div 
        className='grid xl:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-1.5 mt-1.5 sm:grid-cols-2 lg:grid-cols-3'
        >
          {widgets.length === 0 ? (
            <div className="text-center col-span-full py-8 sm:py-12 px-4 sm:px-5 text-base sm:text-lg text-sub-text-dark">
              <p>Нет виджетов. Добавьте виджет, нажав кнопку "Добавить виджет"</p>
            </div>
          ) : (
            // <SortableContext items={widgets} strategy={rectSwappingStrategy}>
              widgets.map((widget) => (
                <div className="widget-container" key={widget.widgetId}>
                  {renderWidget(widget)}
                </div>
              ))
            // </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard
