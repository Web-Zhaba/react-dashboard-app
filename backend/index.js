import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const NEWS_API_KEY = '51f130461f55455591598e3ddb185531';

if (!NEWS_API_KEY) {
  console.error('ERROR: NEWS_API_KEY is not defined in environment variables');
  console.error('Please create a .env file with NEWS_API_KEY=your_api_key');
  console.error('Or set it in your environment: export NEWS_API_KEY=your_api_key');
  process.exit(1);
}

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const newsCache = {};
const CACHE_DURATION = 60 * 60 * 1000;

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
    
    if (newsCache[category] && newsCache[category].timestamp && 
        (now - newsCache[category].timestamp) < CACHE_DURATION) {
      console.log(`✅ Cache hit for: ${category}`);
      return res.json({
        ...newsCache[category].data,
        cached: true,
        cacheAge: Math.floor((now - newsCache[category].timestamp) / 60000)
      });
    }
    
    console.log(`🔄 Fetching fresh news for: ${category}`);
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
    console.error('❌ Error in news endpoint:', error.message);
    
    const category = req.params.category || 'general';
    if (newsCache[category] && newsCache[category].data) {
      console.log('⚠️ Returning cached data due to error');
      return res.json({
        ...newsCache[category].data,
        cached: true,
        error: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch news', 
      message: error.message,
      suggestion: 'Check your .env file and internet connection'
    });
  }
};

// Обработчик для очистки кэша
const handleClearCache = (req, res) => {
  const category = req.params.category;
  
  if (category) {
    if (newsCache[category]) {
      delete newsCache[category];
      console.log(`🗑️ Cache cleared for: ${category}`);
      res.json({ 
        success: true, 
        message: `Cache cleared for category: ${category}` 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `No cache found for category: ${category}` 
      });
    }
  } else {
    const count = Object.keys(newsCache).length;
    Object.keys(newsCache).forEach(key => delete newsCache[key]);
    console.log(`🗑️ All cache cleared (${count} categories)`);
    res.json({ 
      success: true, 
      message: `All news cache cleared (${count} categories)` 
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
    cacheStats: {
      totalCategories: Object.keys(newsCache).length,
      categories: Object.keys(newsCache)
    }
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'News API Backend', 
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

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📰 News API: http://localhost:${PORT}/api/news`);
  console.log(`📰 News by category: http://localhost:${PORT}/api/news/technology`);
  console.log(`📋 Categories: http://localhost:${PORT}/api/news-categories`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔑 API Key configured: ${NEWS_API_KEY ? '✅ Yes' : '❌ No'}`);
});