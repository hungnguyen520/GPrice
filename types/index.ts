export const enum GGroup {
    SJC = 'SJC',
    SJC_R = 'SJC_R',
    DOJI = 'DOJI',
    PNJ = 'PNJ',
    NM = 'NM'
}

export const enum Currency {
    AUD = 'AUD',
    EUR = 'EUR',
    YEN = 'YEN',
    USD = 'USD'
}

/**
 * The price unit is in million VND
 */
export type DomesticPrice = Record<
    GGroup,
    {
        buy: number
        sell: number
    }
>

/**
 * The price unit is in USD
 */
export type GlobalPrice = {
    ounce: number
    tael: number
    taelVND: number
    exchangeRateVND: ExchangeRateVND
}

/**
 * The price unit is in VND
 */
export type ExchangeRateVND = Record<Currency, number>

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
export interface IPageData {
    domesticPrice?: DomesticPrice
    globalPrice?: GlobalPrice
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
            nm: number
            excluded: number
        }
        buy: {
            average: number
            excluded: number
            history: number
        }
    }
}
