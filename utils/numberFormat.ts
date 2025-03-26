export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
}).format(amount);

export const formatNumber = (number: number) => new Intl.NumberFormat().format(number);

export const formatPrice = (price: string | number) => {
    const priceStr = price.toString();
    const firstNum = priceStr.slice(0, 2);
    const lastNum = priceStr.slice(2, 4);
    return firstNum + '.' + lastNum
   
}