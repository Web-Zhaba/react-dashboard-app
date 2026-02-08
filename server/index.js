require ('dotenv').config()

const express = require('express');
const app = express();
const cors = require("cors");
// const corsOptions = {
//     origin: ["http://localhost:5173"],
//     optionsSuccessStatus: 200
// };

// const PORT = process.env.PORT || 8081
const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  console.error('ERROR: NEWS_API_KEY is not defined in environment variables');
  console.error('Please create a .env file with NEWS_API_KEY=your_api_key');
  console.error('Or set it in your environment: export NEWS_API_KEY=your_api_key');
  process.exit(1);
}

const allowedOrigins = [
  'http://localhost:5173',
  'https://dashapp-phi.vercel.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Разрешить запросы без origin (например, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // В режиме разработки разрешаем локальные запросы
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Разрешен origin: ${origin} (dev mode)`);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const newsCache = {};
const CACHE_DURATION = 60 * 60 * 1000;

// Отправка запроса
const fetchNewsFromAPI = async (category = 'general') => {
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=30&apiKey=${NEWS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(`NewsAPI: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error.message);
    throw error;
  }
};

// Обработчик для получения новостей
const handleNewsRequest = async (req, res) => {
  try {
    const category = req.params.category || 'general';
    const now = Date.now();
    
    if (newsCache[category] && newsCache[category].timestamp && (now - newsCache[category].timestamp) < CACHE_DURATION) {
      console.log(`Найден кеш для категории: ${category}`);
      return res.json({
        ...newsCache[category].data,
        cached: true,
        cacheAge: Math.floor((now - newsCache[category].timestamp) / 60000)
      });
    }
    
    console.log(`Запрашиваем свежие новости по категории: ${category}`);
    const data = await fetchNewsFromAPI(category);
    
    const newsData = {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      category: category,
      timestamp: now
    };
    
    newsCache[category] = {
      data: newsData,
      timestamp: now
    };
    
    res.json({
      ...newsData,
      cached: false
    });
    
  } catch (error) {
    console.error('Ошибка в эндпоинте:', error.message);
    
    const category = req.params.category || 'general';
    if (newsCache[category] && newsCache[category].data) {
      console.log('Возврат данных из кеша всвязи с ошибкой');
      return res.json({
        ...newsCache[category].data,
        cached: true,
        error: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Ошибка запроса', 
      message: error.message,
      suggestion: 'Проверьте .env файл и интернет соединение'
    });
  }
};

// Обработчик для очистки кэша
const handleClearCache = (req, res) => {
  const category = req.params.category;
  
  if (category) {
    if (newsCache[category]) {
      delete newsCache[category];
      console.log(`Кеш очищен для: ${category}`);
      res.json({ 
        success: true, 
        message: `Кеш очищен для категории: ${category}` 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `Кеша для этой категории не найдено: ${category}` 
      });
    }
  } else {
    const count = Object.keys(newsCache).length;
    Object.keys(newsCache).forEach(key => delete newsCache[key]);
    console.log(`Весь кеш очищен (${count} категорий)`);
    res.json({ 
      success: true, 
      message: `Весь кеш очищен (${count} категорий)` 
    });
  }
};

// Маршруты
app.get('/api/news', handleNewsRequest);
app.get('/api/news/:category', handleNewsRequest);

app.delete('/api/news/cache', handleClearCache);
app.delete('/api/news/cache/:category', handleClearCache);

app.get('/api/news-categories', (req, res) => {
  res.json([
    { id: 'general', name: 'Общие', icon: '📰' },
    { id: 'business', name: 'Бизнес', icon: '💼' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎭' },
    { id: 'health', name: 'Здоровье', icon: '🏥' },
    { id: 'science', name: 'Наука', icon: '🔬' },
    { id: 'sports', name: 'Спорт', icon: '⚽' },
    { id: 'technology', name: 'Технологии', icon: '💻' },
  ]);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'News API бекэнд', 
    version: '1.0.0',
    endpoints: [
      { path: '/api/news', method: 'GET', description: 'Get general news' },
      { path: '/api/news/:category', method: 'GET', description: 'Get news by category' },
      { path: '/api/news-categories', method: 'GET', description: 'Get available categories' },
      { path: '/api/news/cache', method: 'DELETE', description: 'Clear all cache' },
      { path: '/api/news/cache/:category', method: 'DELETE', description: 'Clear cache for category' },
      { path: '/api/health', method: 'GET', description: 'Health check' }
    ]
  });
});

module.exports = app;