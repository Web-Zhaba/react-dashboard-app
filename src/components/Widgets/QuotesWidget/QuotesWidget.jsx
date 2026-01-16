import { useState, useEffect } from 'react';
import { fetchQuotes } from '../../../services/api/QuotesAPI';
import WidgetContainer from '../WidgetContainer';

const QuotesWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await fetchQuotes();
      setQuote(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
      // Обрабатываем разные форматы ответа
      let processedQuote;
      
      if (Array.isArray(data) && data.length > 0) {
        // Если API возвращает массив, берем первый элемент
        processedQuote = {
          text: data[0].quote || data[0].text || 'Цитата не найдена',
          author: data[0].author || 'Неизвестный автор',
          category: data[0].category || ''
        };
      } else if (data && typeof data === 'object') {
        // Если API возвращает объект
        processedQuote = {
          text: data.quote || data.text || data.content || 'Цитата не найдена',
          author: data.author || 'Неизвестный автор',
          category: data.category || data.tags?.[0] || ''
        };
      } else {
        // Если формат неизвестен
        processedQuote = {
          text: 'Не удалось получить цитату',
          author: 'Система',
          category: 'error'
        };
      }

  useEffect(() => {
    loadQuotes();
  }, []);
  
  return (
    <WidgetContainer 
      title="Цитаты" 
      loading={loading} 
      error={error}
    >
      {quote && (
        <div className="quote-content">
          <blockquote className="quote-text">
            "{quote.text}"
          </blockquote>
          <div className="quote-footer">
            <cite className="quote-author">— {quote.author}</cite>
            {quote.category && (
              <span className="quote-category">{quote.category}</span>
            )}
          </div>
        </div>
      )}
    </WidgetContainer>
  );
};

export default QuotesWidget