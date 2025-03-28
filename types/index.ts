export const enum GGroup {
    SJC = 'SJC',
    DOJI = 'DOJI',
    PNJ = 'PNJ'
}

export const enum GType {
    Bar = 'Bar',
    Ring = 'Ring'
}

export interface IPriceData extends Record<string, any> {
    group: GGroup
    type: GType
    buy: number
    sell: number
    formatted?: {
        buy: string
        sell: string
    }
}

export interface IGlobalPrice {
    ounceUSD: number,
    taelUSD: number,
    taelVND: number,
    rates: IExchangeRate[],
    formatted?: {
        ounceUSD: string,
        taelUSD: string,
        taelVND: string,
        usdRate: string,
    }
}

export interface IExchangeRate {
    code: 'AUD' | 'EUR' | 'YEN' | 'USD',
    value: number
}