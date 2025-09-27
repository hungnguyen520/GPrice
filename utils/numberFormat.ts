export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND'
    }).format(amount)

export const toNumber = (input: any) => {
    const inputStr = input?.toString()
    return inputStr ? parseFloat(inputStr.replace(/,/g, '')) : 0
}

export const formatNumber = (number: number, minDigits = 0) =>
    new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDigits,
        maximumFractionDigits: 3
    }).format(number)

export const formatPrice = (price: number) => {
    const numberStr = formatNumber(price / 1000)
    return numberStr.slice(0, -1)
}
