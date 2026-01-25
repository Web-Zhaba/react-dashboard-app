import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { fetchCurrency, clearCurrencyCache } from '../../../services/api/CurrencyAPI'
import WidgetContainer from '../WidgetContainer';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const CurrencyWidget = memo(({ widgetId, onRemove }) => {
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const loadCurrency = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCurrency();
      setCurrency(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки валют');
      console.error('Ошибка загрузки валют:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrency();
    const intervalId = setInterval(loadCurrency, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [loadCurrency]);

  const handleRefresh = useCallback(() => {
    clearCurrencyCache();
    loadCurrency();
  }, [loadCurrency]);

  const currencyDetails = useMemo(() => {
    if (!currency) return null;
    
    return {
      usdRateString: `${currency.usdRate}₽`,
      eurRateString: `${currency.eurRate}₽`,
      cnyRateString: `${currency.cnyRate}₽`,
      inrRateString: `${currency.inrRate}₽`,
      usdPreviousString: `${currency.usdPrevious}₽`,
      eurPreviousString: `${currency.eurPrevious}₽`,
      cnyPreviousString: `${currency.cnyPrevious}₽`,
      inrPreviousString: `${currency.inrPrevious}₽`,
    };
  }, [currency]);

  function trend(current, previous) {
    if (current > previous) return (<FaArrowUp className="inline text-green-500 w-3 h-3 sm:w-4 sm:h-4" />);
    if (current < previous) return (<FaArrowDown className="inline text-red-500 w-3 h-3 sm:w-4 sm:h-4" />);
    return '';
  }

  return (
    <WidgetContainer
      title={"Курсы валют к рублю"}
      loading={loading} 
      widgetType="currency"
      error={error}
      onRefresh={handleRefresh}
      widgetId={widgetId}
      onRemove={onRemove}
    >
      {currency && currencyDetails && (
        <div className='currency-content space-y-3 sm:space-y-4'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background-dark rounded-lg'>
            <div className='text-sm sm:text-base font-medium'>1$ Доллар США</div>
            <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
              <span className='text-lg sm:text-xl font-bold'>{currencyDetails.usdRateString}</span>
              <span className='flex items-center text-sub-text-dark text-xs sm:text-sm'>
                {trend(currency.usdRate, currency.usdPrevious)}
                <span className='ml-1'>{currency.usdPrevious}₽</span>
              </span>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background-dark rounded-lg'>
            <div className='text-sm sm:text-base font-medium'>1€ Евро</div>
            <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
              <span className='text-lg sm:text-xl font-bold'>{currencyDetails.eurRateString}</span>
              <span className='flex items-center text-sub-text-dark text-xs sm:text-sm'>
                {trend(currency.eurRate, currency.eurPrevious)}
                <span className='ml-1'>{currency.eurPrevious}₽</span>
              </span>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background-dark rounded-lg'>
            <div className='text-sm sm:text-base font-medium'>1¥ Юань</div>
            <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
              <span className='text-lg sm:text-xl font-bold'>{currencyDetails.cnyRateString}</span>
              <span className='flex items-center text-sub-text-dark text-xs sm:text-sm'>
                {trend(currency.cnyRate, currency.cnyPrevious)}
                <span className='ml-1'>{currency.cnyPrevious}₽</span>
              </span>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background-dark rounded-lg'>
            <div className='text-sm sm:text-base font-medium'>100₹ Индийских рупий</div>
            <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
              <span className='text-lg sm:text-xl font-bold'>{currencyDetails.inrRateString}</span>
              <span className='flex items-center text-sub-text-dark text-xs sm:text-sm'>
                {trend(currency.inrRate, currency.inrPrevious)}
                <span className='ml-1'>{currency.inrPrevious}₽</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
});

CurrencyWidget.displayName = 'CurrencyWidget';
export default CurrencyWidget;