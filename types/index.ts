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
    buy: string | number
    sell: string | number
}