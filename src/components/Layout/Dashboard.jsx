import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Мой дашборд</h1>
        <span>{new Date().toLocaleDateString()}</span>
      </header>
      
      <div className="widgets-grid">
        {/* Здесь будут виджеты */}
      </div>
    </div>
  );
};

export default Dashboard