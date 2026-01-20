import { useState, useEffect } from 'react';
import { fetchCurrency } from '../../../services/api/CurrencyAPI'
import WidgetContainer from '../WidgetContainer';

const CurrencyWidget = () => {
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

    function trend(current, previous) {
    if (current > previous) return (<span style={{ color: 'green' }}>▲</span>);
    if (current < previous) return (<span style={{ color: 'red' }}>▼</span>);
    return '';
  }
  return (
    <WidgetContainer
    title={"Курсы валют к рублю"}
    loading={loading} 
    error={error}
    >
        {currency && (
            <div className='currency-content'>
                <div className='usd'>1$ Доллар США = {currency.usdRate}₽ {trend(currency.usdRate, currency.usdPrevious)}</div>
                <div className='eur'>1€ Евро = {currency.eurRate}₽ {trend(currency.eurRate, currency.eurPrevious)}</div>
                <div className='cny'>1￥ Юань = {currency.cnyRate}₽ {trend(currency.cnyRate, currency.cnyPrevious)}</div>
                <div className='inr'>100₹ Индийских рупий = {currency.inrRate}₽ {trend(currency.inrRate, currency.inrPrevious)}</div>
            </div>
        )}
    </WidgetContainer>
  )

}

export default CurrencyWidget;