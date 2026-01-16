import '../../styles/Dashboard.css';
import '../Widgets/WidgetContainer'
import '../Widgets/WeatherWidget/WeatherWidget'
import WeatherWidget from '../Widgets/WeatherWidget/WeatherWidget';
import QuotesWidget from '../Widgets/QuotesWidget/QuotesWidget';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Мой дашборд</h1>
        <span>{new Date().toLocaleDateString()}</span>
      </header>
      <div className="widgets-grid">
        <WeatherWidget />
        <QuotesWidget />
      </div>
    </div>
  );
};

export default Dashboard