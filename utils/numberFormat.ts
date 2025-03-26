export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);

export const toNumber = (input: any) => {
    const inputStr = input?.toString();
    return inputStr ? parseFloat(inputStr.replace(/,/g, '')) : 0;
};

export const formatNumber = (number: number, minDigits = 2) =>
    new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDigits,
        maximumFractionDigits: 2
    }).format(number);

export const formatPrice = (price: string | number) => {
    const priceStr = price.toString();
    const firstNum = priceStr.slice(0, 2);
    const lastNum = priceStr.slice(2, 4);
    return firstNum + '.' + lastNum;
};
