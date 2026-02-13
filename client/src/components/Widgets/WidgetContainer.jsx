import { 
  MdClose, 
  MdRefresh, 
  MdSettings, 
  MdDragIndicator,
  MdEdit,
  MdCheck
} from 'react-icons/md';
import { useState, useCallback, useEffect } from 'react';
import './container.css'

const WidgetContainer = ({
  title,
  children,
  loading = false,
  error = null,
  onRefresh,
  onRemove,
  onSettings,
  isDraggable = true,
  widgetId,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  // Синхронизация при изменении внешнего заголовка (например, при загрузке)
  useEffect(() => {
    const savedTitle = localStorage.getItem(`widget-title-${widgetId}`);
    if (savedTitle) {
      setEditedTitle(savedTitle);
    } else {
      setEditedTitle(title);
    }
  }, [title, widgetId]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSave = useCallback(() => {
    setIsEditingTitle(false);
    if (editedTitle.trim()) {
      localStorage.setItem(`widget-title-${widgetId}`, editedTitle.trim());
    } else {
      setEditedTitle(title);
      localStorage.removeItem(`widget-title-${widgetId}`);
    }
  }, [editedTitle, widgetId, title]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      const savedTitle = localStorage.getItem(`widget-title-${widgetId}`);
      setEditedTitle(savedTitle || title);
    }
  };

  return (
    <div
    className={`widget ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
    data-widget-id={widgetId}
    >
      <div className="widget-header">
        <div className="widget-header-left flex-1 min-w-0">
          {isDraggable && (
            <span className="drag-handle shrink-0">
              <MdDragIndicator size={25} />
            </span>
          )}
          {isEditingTitle ? (
            <div className="flex items-center gap-1 grow mr-2">
              <input
                autoFocus
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleSave}
                onKeyDown={handleKeyDown}
                className="widget-title outline-none w-full flex items-center gap-2 truncate"
              />
              <button onClick={handleTitleSave} className="text-green-500 hover:text-green-400">
                <MdCheck size={18} />
              </button>
            </div>
          ) : (
            <h3 
              className="widget-title truncate cursor-pointer hover:text-gray-300 flex items-center gap-2" 
              onClick={handleTitleClick}
              title="Нажмите, чтобы переименовать"
            >
              {editedTitle}
              <MdEdit size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          )}
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
