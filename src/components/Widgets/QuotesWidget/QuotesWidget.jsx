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
      console.log(quote.quote)
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
  
  return (
    <WidgetContainer 
      title="Цитаты" 
      loading={loading} 
      error={error}
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