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
export type DomesticPrice = Partial<
    Record<
        GGroup,
        {
            buy: number
            sell: number
        }
    >
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
export type ExchangeRateVND = Partial<Record<Currency, number>>

export interface HistoricalRecord {
    group: GGroup
    value: number
    quantity: number
    date: string
}

export interface HistoricalData {
    data: HistoricalRecord[]
    excluded: {
        quantity: number
    }
}
export interface IPageData {
    domesticPrice?: DomesticPrice
    globalPrice?: GlobalPrice
}

export interface HistoricalViewModel {
    data: {
        group: GGroup
        value: number
        quantity: number
        total: string
        date: string
    }[]
    value: {
        avg: number
        sum: number
    }
    quantity: {
        total: number
        sjc: number
        sjcR: number
        pnj: number
        doji: number
        nm: number
    }
    excluded: {
        quantity: number
    }
}

export interface ILotteryDrawTable {
    day: string
    date: string
    code: string
    price8: number[]
    price7: number[]
    price6: number[]
    price5: number[]
    price4: number[]
    price3: number[]
    price2: number[]
    price1: number[]
    priceS: number[]
}

export interface ILotteryDrawResult {
    pageTitle: string
    dataTables: ILotteryDrawTable[]
}
