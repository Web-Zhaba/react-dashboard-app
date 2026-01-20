import '../../styles/Dashboard.css';
import '../Widgets/WidgetContainer'
import '../Widgets/WeatherWidget/WeatherWidget'
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import QuotesWidget from '../Widgets/QuotesWidget/QuotesWidget';
import CurrencyWidget from '../Widgets/CurrencyWidget/CurrencyWidget'

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Шапка дашборда */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Мой Дашборд</h1>
          <span className="dashboard-subtitle">
            {new Date().toLocaleDateString('ru-RU')}
          </span>
        </div>
        {/* <div className="header-right">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Добавить виджет
          </button>
          <button className="btn btn-secondary">
            Сохранить макет
          </button>
        </div> */}
      </header>
      <div className="widgets-grid">
        <WeatherWidget />
        <QuotesWidget />
        <CurrencyWidget />
      </div>
    </div>
  );
};

export default Dashboard