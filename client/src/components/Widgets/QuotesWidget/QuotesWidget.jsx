import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { fetchQuotes, clearQuotesCache } from '../../../services/api/QuotesAPI';
import WidgetContainer from '../WidgetContainer';

const QuotesWidget = memo(({ widgetId, onRemove }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const loadQuotes = useCallback (async () => {
    try {
      setLoading(true);
      const data = await fetchQuotes();
      setQuote(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки цитат');
      console.error('Ошибка загрузки цитат:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes();
    // Автообновление каждые 20 минут
    // const intervalId = setInterval(loadQuotes, 20 * 60 * 1000);
    // return () => clearInterval(intervalId);
  }, [loadQuotes]);
  
  const handleRefresh = useCallback(() => {
    clearQuotesCache();
    loadQuotes();
  }, [loadQuotes]);


  const quotesDetails = useMemo(() => {
    if (!quote) return null;
    
    return {
      quoteString: `${quote.quote}`,
      authorString: `${quote.author}`,
      categoriesArray: Array.isArray(quote.category) ? quote.category : [quote.category],
    };
  }, [quote]);

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
      {quote && quotesDetails && (
        <div className="quote-content flex flex-col h-full">
          <blockquote className="bg-background-dark p-4 sm:p-5 rounded-xl text-center text-sm sm:text-base lg:text-lg grow flex items-center justify-center">
            "{quotesDetails.quoteString}"
          </blockquote>
          
          <div className="quote-footer mt-4 text-center">
            <cite className="quote-author block text-sub-text-dark text-xs sm:text-sm mb-2">
              — {quotesDetails.authorString}
            </cite>
            
            {quotesDetails.categoriesArray && quotesDetails.categoriesArray.length > 0 && (
              <ul className="space-y-1 text-left">
                {quotesDetails.categoriesArray.map((category, index) => (
                  <li 
                    key={index} 
                    className="text-sub-text-dark text-xs flex items-center"
                  >
                    <span className="w-2 h-2 bg-accent-dark rounded-full mr-2"></span>
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </WidgetContainer>
  );
});
QuotesWidget.displayName = 'QuotesWidget';
export default QuotesWidget