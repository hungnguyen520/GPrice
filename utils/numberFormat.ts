export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
}).format(amount);

export const formatNumber = (number: number) => new Intl.NumberFormat().format(number);

export const roundToThousand = (number: number) => {
    return Math.round(number / 1000);
};

export const formatGPrice = (number: number) => formatNumber(roundToThousand(number))