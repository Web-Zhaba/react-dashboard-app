import { useState, useEffect } from 'react';
import { fetchCurrency } from '../../../services/api/CurrencyAPI'
import WidgetContainer from '../WidgetContainer';
import './currency.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const CurrencyWidget = ({ widgetId, onRemove }) => {
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const loadCurrency = async () => {
    try {
      setLoading(true);
      const data = await fetchCurrency();
      setCurrency(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrency();
  }, []);

  const handleRefresh = () => {
    loadCurrency();
  };

    function trend(current, previous) {
    if (current > previous) return (<FaArrowUp color="green" />);
    if (current < previous) return (<FaArrowDown color="red" />);
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
        {currency && (
            <div className='currency-content'>
                <div className='usd'>1$ Доллар США = {currency.usdRate}₽ {trend(currency.usdRate, currency.usdPrevious)}<span className='previous'>{currency.usdPrevious}₽</span></div>
                <div className='eur'>1€ Евро = {currency.eurRate}₽ {trend(currency.eurRate, currency.eurPrevious)}<span className='previous'>{currency.eurPrevious}₽</span></div>
                <div className='cny'>1￥ Юань = {currency.cnyRate}₽ {trend(currency.cnyRate, currency.cnyPrevious)}<span className='previous'>{currency.cnyPrevious}₽</span></div>
                <div className='inr'>100₹ Индийских рупий = {currency.inrRate}₽ {trend(currency.inrRate, currency.inrPrevious)}<span className='previous'>{currency.inrPrevious}₽</span></div>
            </div>
        )}
    </WidgetContainer>
  )

}

export default CurrencyWidget;