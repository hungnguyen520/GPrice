export const enum GGroup {
    SJC = 'SJC',
    SJC_R = 'SJC_R',
    DOJI = 'DOJI',
    PNJ = 'PNJ'
}
export interface IPriceData extends Record<string, any> {
    group: GGroup
    buy: number
    sell: number
    formatted?: {
        buy: string
        sell: string
    }
}

export interface IGlobalPrice {
    ounceUSD: number
    taelUSD: number
    taelVND: number
    rates: IExchangeRate[]
    formatted?: {
        ounceUSD: string
        taelUSD: string
        taelVND: string
        usdRate: string
    }
}

export interface IExchangeRate {
    code: 'AUD' | 'EUR' | 'YEN' | 'USD'
    value: number
}

export interface HistoricalRecord {
    group: GGroup
    buy: number
    quantity: number
    date: string
}

export interface HistoricalData {
    data: HistoricalRecord[]
    excluded: {
        quantity: number
        value: number
    }
}
export interface IPageState {
    prices?: IPriceData[]
    globalPrice?: IGlobalPrice
}

export interface HistoricalViewModel {
    historyTable: {
        group: GGroup
        buy: number
        quantity: number
        value: string
        date: string
    }[]
    sumHistoryTable: {
        title: string
        quantity: number
        buy: string
    }[]
    summary: {
        quantity: {
            total: number
            sjc: number
            sjcR: number
            pnj: number
            doji: number
            excluded: number
        }
        buy: {
            average: number
            excluded: number
            history: number
        }
    }
}
