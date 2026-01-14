import { MdRefresh, MdSettings, MdDelete } from 'react-icons/md';

const WidgetContainer = ({ title, children, loading, error }) => {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3>{title}</h3>
        <button className="widget-refresh"><MdRefresh size={20} /></button>
      </div>
      
      <div className="widget-content">
        {loading && <div className="loading">Загрузка...</div>}
        {error && <div className="error">Ошибка: {error}</div>}
        {!loading && !error && children}
      </div>
    </div>
  );
};

export default WidgetContainer