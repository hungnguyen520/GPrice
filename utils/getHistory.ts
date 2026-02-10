import { GGroup, HistoricalRecord, HistoricalViewModel } from '@/types'
import { formatNumber } from './numberFormat'

const historyData: HistoricalRecord[] = [
    {
        group: GGroup.SJC_R,
        value: 65.5,
        quantity: 6.5,
        date: '01/03/24'
    },
    {
        group: GGroup.SJC_R,
        value: 66.5,
        quantity: 0.5,
        date: '02/03/24'
    },
    {
        group: GGroup.SJC_R,
        value: 69.3,
        quantity: 1,
        date: '09/03/24'
    },
    {
        group: GGroup.SJC_R,
        value: 69.6,
        quantity: 0.5,
        date: '09/03/24'
    },
    {
        group: GGroup.SJC_R,
        value: 76.2,
        quantity: 0.5,
        date: '13/04/24'
    },
    {
        group: GGroup.SJC_R,
        value: 74.8,
        quantity: 0.6,
        date: '04/05/24'
    },
    {
        group: GGroup.SJC,
        value: 78,
        quantity: 1,
        date: '30/08/24'
    },
    {
        group: GGroup.SJC,
        value: 81,
        quantity: 1,
        date: '18/09/24'
    },
    {
        group: GGroup.SJC,
        value: 80.5,
        quantity: 1,
        date: '09/10/24'
    },
    {
        group: GGroup.SJC,
        value: 85.3,
        quantity: 1,
        date: '27/11/24'
    },
    {
        group: GGroup.PNJ,
        value: 90.1,
        quantity: 0.4,
        date: '08/02/25'
    },
    {
        group: GGroup.SJC_R,
        value: 90.6,
        quantity: 0.4,
        date: '10/02/25'
    },
    {
        group: GGroup.DOJI,
        value: 91.2,
        quantity: 2.7,
        date: '10/02/25'
    },
    {
        group: GGroup.DOJI,
        value: 91.4,
        quantity: 6.3,
        date: '11/02/25'
    },
    {
        group: GGroup.DOJI,
        value: 90.7,
        quantity: 2,
        date: '13/02/25'
    },
    {
        group: GGroup.DOJI,
        value: 90.3,
        quantity: 1,
        date: '16/02/25'
    },
    {
        group: GGroup.DOJI,
        value: 100.5,
        quantity: 1,
        date: '09/04/25'
    },
    {
        group: GGroup.DOJI,
        value: 120,
        quantity: 2.6,
        date: '01/06/25'
    }
]

const formattedData = historyData.map((d) => {
    return {
        ...d,
        total: formatNumber(d.value * d.quantity)
    }
})

const _sumQuantity = historyData.reduce(
    (sum, current) => (sum += current.quantity),
    0
)

const sumQuantity = Math.round(_sumQuantity * 10) / 10

const sumValue = historyData.reduce(
    (sum, current) => (sum += current.value * current.quantity),
    0
)
const avgValue = sumValue / sumQuantity

const sjcQuantity = historyData.reduce(
    (sum, current) =>
        current.group === GGroup.SJC ? (sum += current.quantity) : sum,
    0
)

const sjsRQuantity = historyData.reduce(
    (sum, current) =>
        current.group === GGroup.SJC_R ? (sum += current.quantity) : sum,
    0
)

const dojiQuantity = historyData.reduce(
    (sum, current) =>
        current.group === GGroup.DOJI ? (sum += current.quantity) : sum,
    0
)

const pnjQuantity = historyData.reduce(
    (sum, current) =>
        current.group === GGroup.PNJ ? (sum += current.quantity) : sum,
    0
)

const historicalViewData: HistoricalViewModel = {
    data: formattedData,
    value: {
        avg: avgValue,
        sum: sumValue
    },
    quantity: {
        total: sumQuantity,
        sjcR: sjsRQuantity,
        doji: dojiQuantity,
        sjc: sjcQuantity,
        pnj: pnjQuantity
    }
}

export default historicalViewData
