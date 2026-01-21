const url = 'https://api.api-ninjas.com/v2/randomquotes'

export const fetchQuotes = async () => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'X-Api-Key': 'Axy3pXKaBjg5tgyg1BlYBrahAZFFViITaOJVan1s',
                // 'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) throw new Error('Ошибка запроса');

        const data = await response.json();
        console.log('Полученные данные из API цитат:', data);
        return {
            quote: data[0].quote,
            author: data[0].author,
            category: data[0].category
        }
    } catch (error) {
        throw error;
    }
};