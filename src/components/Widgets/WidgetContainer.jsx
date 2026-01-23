import { 
  MdClose, 
  MdRefresh, 
  MdSettings, 
  MdDragIndicator 
} from 'react-icons/md';
import './container.css'


// Контейнер для виджетов с общим функционалом
// @param {Object} props
// @param {string} props.title - Заголовок виджета
// @param {ReactNode} props.children - Контент виджета
// @param {boolean} props.loading - Состояние загрузки
// @param {string} props.error - Сообщение об ошибке
// @param {Function} props.onRefresh - Функция обновления данных
// @param {Function} props.onRemove - Функция удаления виджета
// @param {Function} props.onSettings - Функция открытия настроек
// @param {boolean} props.draggable - Возможность перетаскивания


const WidgetContainer = ({
  title,
  children,
  loading = false,
  error = null,
  onRefresh,
  onRemove,
  onSettings,
  isDraggable = true,
  widgetType,
  widgetId,
}) => {
  return (
    <div
    className={`widget ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
    data-widget-id={widgetId}
    >
      <div className="widget-header">
        <div className="widget-header-left">
          {isDraggable && (
            <span className="drag-handle">
              <MdDragIndicator size={25} />
            </span>
          )}
          <h3 className="widget-title">{title}</h3>
        </div>
        
        <div className="widget-actions">
          {onRefresh && (
            <button 
              className="action-btn refresh-btn"
              onClick={onRefresh}
              title="Обновить"
              disabled={loading}
            >
              <MdRefresh className={loading ? 'spinning' : ''} />
            </button>
          )}
          
          {onSettings && (
            <button 
              className="action-btn settings-btn"
              onClick={onSettings}
              title="Настройки"
            >
              <MdSettings />
            </button>
          )}
          
          {onRemove && (
            <button 
              className="action-btn remove-btn"
              onClick={onRemove}
              title="Удалить виджет"
            >
              <MdClose />
            </button>
          )}
        </div>
      </div>
      
      <div className="widget-content">
        {loading && (
          <div className="widget-loading">
            <div className="spinner"></div>
            <span>Загрузка...</span>
          </div>
        )}
        
        {error && !loading && (
          <div className="widget-error">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            {onRefresh && (
              <button 
                className="retry-btn"
                onClick={onRefresh}
              >
                Попробовать снова
              </button>
            )}
          </div>
        )}
        
        {!loading && !error && children}
      </div>
    </div>
  );
};

export default WidgetContainer