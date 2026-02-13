import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { fetchCurrency, clearCurrencyCache } from '../../../services/api/CurrencyAPI'
import WidgetContainer from '../WidgetContainer';
import CurrencyRow from './parts/CurrencyRow';
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

  const [amount, setAmount] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const convertedValue = useMemo(() => {
    if (!currency) return 0;
    const rate = selectedCurrency === 'USD' ? currency.usdRate :
                 selectedCurrency === 'EUR' ? currency.eurRate :
                 selectedCurrency === 'CNY' ? currency.cnyRate :
                 (currency.inrRate / 100);
    return (amount * rate).toFixed(2);
  }, [amount, selectedCurrency, currency]);

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
      {currency && (
        <div className='currency-content space-y-3 sm:space-y-4'>
          <CurrencyRow 
            label="1$ Доллар США" 
            rate={currency.usdRate} 
            previous={currency.usdPrevious} 

          />
          <CurrencyRow 
            label="1€ Евро" 
            rate={currency.eurRate} 
            previous={currency.eurPrevious} 

          />
          <CurrencyRow 
            label="1¥ Юань" 
            rate={currency.cnyRate} 
            previous={currency.cnyPrevious} 

          />
          <CurrencyRow 
            label="100₹ Индийских рупий" 
            rate={currency.inrRate} 
            previous={currency.inrPrevious} 
          />

          {/* Конвертер */}
          <div className="mt-4 p-3 bg-background-dark rounded-lg border border-gray-700">
            <div className="text-xs text-sub-text-dark mb-2 uppercase font-bold tracking-wider">Быстрый конвертер</div>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-accent-dark"
                min="0"
              />
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-accent-dark cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="INR">INR (₹)</option>
              </select>
              <div className="grow text-right font-bold text-accent-dark">
                = {convertedValue} ₽
              </div>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
});

CurrencyWidget.displayName = 'CurrencyWidget';
export default CurrencyWidget;