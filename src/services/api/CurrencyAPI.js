const url = 'https://www.cbr-xml-daily.ru/daily_json.js'

export const fetchCurrency = async () => {
    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error('Ошибка запроса');

        const data = await response.json();
        console.log('Полученные данные из API курсов валют:', data);
        return {
            usdRate: data.Valute.USD.Value.toFixed(2).replace('.', ','),
            usdPrevious: data.Valute.USD.Previous.toFixed(2).replace('.', ','),
            eurRate: data.Valute.EUR.Value.toFixed(2).replace('.', ','),
            eurPrevious: data.Valute.EUR.Previous.toFixed(2).replace('.', ','),
            cnyRate: data.Valute.CNY.Value.toFixed(2).replace('.', ','),
            cnyPrevious: data.Valute.CNY.Previous.toFixed(2).replace('.', ','),
            inrRate: data.Valute.INR.Value.toFixed(2).replace('.', ','),
            inrPrevious: data.Valute.INR.Previous.toFixed(2).replace('.', ',')
        }
    } catch (error) {
        throw error;
    }
};