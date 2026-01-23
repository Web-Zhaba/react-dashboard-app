import { useState, useEffect } from 'react';
import { fetchQuotes } from '../../../services/api/QuotesAPI';
import WidgetContainer from '../WidgetContainer';
import './quotes.css'

const QuotesWidget = ({ widgetId, onRemove }) => {
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

  useEffect(() => {
    loadQuotes();
  }, []);
  
  const handleRefresh = () => {
    loadQuotes();
  };

  return (
    <WidgetContainer 
      title="Цитаты" 
      loading={loading} 
      error={error}
      widgetType="quotes"
      onRefresh={handleRefresh}
      widgetId={widgetId}
      onRemove={onRemove}
    >
      {quote && (
        <div className="quote-content">
          <blockquote className="quote-text">
            "{quote.quote}"
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